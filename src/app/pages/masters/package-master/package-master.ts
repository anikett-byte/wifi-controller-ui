import { Component, inject, TemplateRef, ViewEncapsulation, viewChild, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule, provideFormlyConfig } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { Common } from '../../../services/common';
import { Master } from '../../../services/master';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-master',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule,],
  templateUrl: './package-master.html',
  styleUrl: './package-master.scss'
})
export class PackageMaster {

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [{ field: 'packagename', title: 'PackageName' }, { field: 'packagetype', title: 'PackageType' }, { field: 'rate_limit_DL', title: 'DL' }, { field: 'rate_limit_UL', title: 'UL' }, { field: 'createdon', title: 'CreatedOn' }, { field: 'amount', title: 'Amount' }, { field: 'rate_limit_UL', title: 'UL' }, { field: 'isactive', title: 'IsActive' }];

  tableButtons: any = [{ lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editDetails', function_parameter_field: 'name', btnColor: 'btn-outline-primary' },
  // { lable: '<i class="fa fa-eye" aria-hidden="true"></i>', function: 'viewDetails', function_parameter_field: 'name', btnColor: 'btn-primary' },
  { lable: '<i class="fa fa-trash" aria-hidden="true"></i>', function: 'deletePackage', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-danger' }
  ];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  @ViewChild('content') content!: TemplateRef<any>;

  ngOnInit() {
    this.loadFormFields();
    const res = { pkid: 0 };
    this.fetchPackage(res);
    this.fetchNasListAndBuildForm();
    this.fetchPackageTypeForDropdown();
  }


  getFieldByKey(key: string, fields: FormlyFieldConfig[]): FormlyFieldConfig | undefined {
    for (const field of fields) {
      if (field.key === key) {
        return field;
      }

      if (field.fieldGroup) {
        const found = this.getFieldByKey(key, field.fieldGroup);
        if (found) return found;
      }
    }
    return undefined;
  }

  rowSelected: any;
  getSelectedRows(data: any) {
    this.rowSelected = data;
  }

  getTableData(filter: any) {
    this.recordFrom = parseInt(filter.startFrom);
    this.recordLimit = parseInt(filter.limitTo);
  }

  viewDetails(data: any) {
    console.log('Inside View', data);
  }
  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  openCompanyDetailsModal(content: TemplateRef<any>) {
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'xl' });
  }

  isEditMode: boolean = false;
  editDetails(data: any) {
    this.isEditMode = true;
    const parsedRow = typeof data === 'string' ? JSON.parse(data) : data;
    this.master.getSelectedPackageDetails(parsedRow.pkid).subscribe((res: any) => {
      console.log("API raw response:", res);
      // this.master.getSelectedPackageDetails(id).subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          let data = res.data[0];
          console.log("data------------->", data);
          this.formModel = structuredClone(data);
          this.form.reset();
          this.form.patchValue({
            pkid: data.pkid,
            packagaename: data.packagaename,
            packagetype: data.packagetype,
            rate_limit_DL: data.rate_limit_DL,
            rate_limit_UL: data.rate_limit_DL,
            nasname: data.nasname,
            isDSCPEnable: data.isDSCPEnable
          });

        }
      }
    });

    this.modalService.open(this.content, { size: 'xl' });
  }

  loadFormFields() {
    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'pkid',
            type: 'input',
            templateOptions: {
              type: 'hidden',
            },

          },

          {
            key: 'packagename',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Package Name',
              required: true,
            }
          },
          {
            key: 'packagetype',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: 'Package Type',
              placeholder: 'Select Type',
              options: this.pckgtype,
              valueProp: 'id',
              labelProp: 'name',
              change: (field, $event) => {
                const pcktypeId = field.formControl?.value;
                console.log('Selected NAS Type:', pcktypeId);

              }

            }
          },
          {
            key: 'nasid',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: ' Allowed NAS',
              placeholder: 'Select NAS',
              options: this.nasList,
              valueProp: 'id',
              labelProp: 'name',
              change: (field, $event) => {
                const selectedNasId = field.formControl?.value;

              }
            }
          },
        ]
      },

      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'rate_limit_DL',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Download Limit',
              type: 'number',
              required: true,
            }
          },
          {
            key: 'rate_limit_UL',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Upload Limit',
              type: 'number',
              required: true,
            }
          },
          {
            key: 'isEnabled',
            type: 'checkbox',
            className: 'col-md-4',
            templateOptions: {
              label: 'DSCP',
            },
            expressionProperties: {
              'templateOptions.label': (model: any, formState: any) => model.isEnabled ? 'DSCP ' : 'DSCP',
            },
            hooks: {
              onInit: (field) => {
                // Optional: initial value
                // field.formControl.setValue(true);
              }
            },
            defaultValue: true // Optional default
          },
           {
        key: 'extraField1',
        type: 'input',
        className: 'col-md-4',
        templateOptions: {
          label: 'DSCP Name',
        },
        hideExpression: '!model.isEnabled'
      },
      {
        key: 'extraField2',
        type: 'select',
        className: 'col-md-4',
        templateOptions: {
          label: 'DSCP Value',
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' }
          ]
        },
        hideExpression: '!model.isEnabled'
      },
      {
        key: 'extraField3',
        type: 'input',
        className: 'col-md-4',
        templateOptions: {
          label: 'DSCP Speed (MB)',
          options: []
        },
        hideExpression: '!model.isEnabled'
      }


        ]
      },

      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'isDSCPEnable',
            type: 'checkbox',
            className: 'col-md-4',
            templateOptions: {
              label: 'Enable DSCP?',
            }
          },
          {
            key: 'toss_value',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'TOSS Value',
              type: 'number'
            }
          }
        ]
      }
    ];
    this.formModel = {};
  }

  addPackage() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    this.master.addPackage(payload).subscribe((res: any) => {
      console.log('API Response:', res);

      const response = res[0][0][0];

      if (response.status === 1) {
        console.log("------Package Added Successfully", response)
        this.master.toasterSuccessMsg(response.alertmessage);
        this.modalService.dismissAll();
        const res = { pkid: 0 };
        this.fetchPackage(res);
      } else {
        this.master.toasterFailureMsg(response.alertmessage);
      }
    });
  }

  nasList: any[] = [];

  fetchNasListAndBuildForm(): void {
    const id = 0;
    this.master.fetchNAS(id).subscribe(
      (res: any) => {
        const records = res[0][0];
        if (Array.isArray(records)) {
          this.nasList = records.map(item => ({
            id: item.id,
            name: item.nasname
          }));
        }
        console.log('NAS options in form:', this.nasList);

        this.formFields = [];
        this.loadFormFields();
      });
  }

  fetchPackage(pkid: any) {
    this.dataSource = [];

    this.master.fetchPackage(pkid).subscribe((res: any) => {
      if (Array.isArray(res) && Array.isArray(res[0])) {
        const records = res[0];
        if (records[0]?.status === 0) {
          console.warn(records[0].alertmessage); // Not found case
        } else {
          this.dataSource = records;
        }
      } else {
        console.warn("Unexpected response format");
      }
    });
  }

  pckgtype: any[] = [];
  fetchPackageTypeForDropdown(): void {
    const id = 0;
    this.master.fetchPackageTypeForDropdown(id).subscribe(
      (res: any) => {
        const records = res[0][0];
        if (Array.isArray(records)) {
          this.pckgtype = records.map(item => ({
            id: item.id,
            name: item.packagetype
          }));
        }
        console.log('Package options in form:', this.pckgtype);

        this.formFields = [];
        this.loadFormFields();
      });
  }

  deletePackage(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    // const deleteTarget = { ...parsedRow, id: parsedRow.id };
    const pkid = parsedRow.pkid;
    // console.log('-----deleteTarget------->', deleteTarget);
    console.log('-----row--->', row)


    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.pkid}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          pkid: pkid
        };
        this.master.deletePackage(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0] || res
          if (resultData?.status === 1) {
            this.master.toasterSuccessMsg(resultData.alertmessage);
            this.modalService.dismissAll();
            this.dataSource = this.dataSource.filter(item => item.pkid !== pkid);
          } else {
            this.master.toasterWarningMsg(resultData.alertmessage);
          }
        });
      }
    },
    );
  }
}
