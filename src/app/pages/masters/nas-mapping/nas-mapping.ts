import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { Common } from '../../../services/common';
import { Master } from '../../../services/master';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { TableComponent } from '../../../shared-components/table/table.component';
import Swal from 'sweetalert2';
// import { log } from 'console';

@Component({
  selector: 'app-nas-mapping',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule],
  templateUrl: './nas-mapping.html',
  styleUrl: './nas-mapping.scss'
})
export class NasMapping {

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [
    // { field: 'nasid', title: 'Nas ID' }, 
    { field: 'nasname', title: 'NAS Name' },
    { field: 'packagename', title: ' Package Name' },
    { field: 'updatedby', title: 'Updatedby' },
    { field: 'updatedon', title: 'UpdatedOn' },
    { field: 'isactive', title: 'IsActive' }
  ];

  tableButtons: any = [
    // { lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editDetails', function_parameter_field: '', btnColor: 'btn-outline-primary' },
    { lable: '<i class="fa fa-trash" aria-hidden="true"></i>', function: 'deletenasmapping', function_parameter_field: 'row', ft_param_field_vldtn: '', btnColor: 'btn-danger' }
  ];

  @ViewChild('content') content!: TemplateRef<any>;


  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  ngOnInit() {
    this.formModel = {};
    this.fetchNasListAndBuildForm();
    this.fetchPackageListAndBuildForm();
    const res = { id: 0 }
    this.fetchNASMapping(res);
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
  openCompanyDetailsModal(content: TemplateRef<any>) {
    this.formModel = {};
    this.form.reset();
    this.form.enable();
    this.modalService.open(content, { size: 'xl' });
  }

  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  loadFormFields() {
    this.formFields = [

      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'nasid',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: 'NAS',
              placeholder: 'Select NAS',
              options: this.nasList,
              valueProp: 'id',
              labelProp: 'name',
              change: (field, $event) => {
                const selectedNasId = field.formControl?.value;

              }
            }
          },
          {
            key: 'pkid',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: 'Package',
              placeholder: 'Select Package',
              options: this.packagelist,
              valueProp: 'id',
              labelProp: 'name',
              change: (field, $event) => {
                const selectedPackageId = field.formControl?.value;

              }
            }
          },
          {
            key: 'IsMappedActive',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Is Active'
            },
            expressionProperties: {
              'model.IsMappedActive': (model, formState) => !!model.IsMappedActive ? 1 : 0,
            }
          }
        ]
      }
    ]

  }
  fetchNAS() {

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
  packagelist: any[] = [];

  fetchPackageListAndBuildForm(): void {
    const pkid = 0;
    this.master.fetchPackage(pkid).subscribe((res: any) => {
      if (Array.isArray(res) && Array.isArray(res[0])) {
        const records = res[0];

        if (records[0]?.status === 0) {
          console.warn(records[0].alertmessage);
          this.packagelist = [];
        }
        else {
          this.packagelist = records.map(item => ({
            id: item.pkid,
            name: item.packagename
          }));
          console.log('Mapped package list:', this.packagelist);
        }

        this.loadFormFields();
      }
      else {
        console.warn('Unexpected response format for packages');
      }
    });
  }

  fetchNASMapping(id: any) {
    this.dataSource = [];
    this.master.fetchNASMapping(id).subscribe((res: any) => {
      console.log(
        res
      );
      try {
        const records = res?.[0]?.[0];
        if (Array.isArray(records) && records.length > 0 && typeof records[0] === 'object') {
          this.dataSource = records;
        }
        else {
        }
      } catch (e) {

      }
    });
  }

  submitNasMapping() {
    const clientIp = localStorage.getItem('clientip') || '0.0.0.0'; // or retrieve dynamically

    const payload = {
      nasid: this.formModel.nasid,
      packageid: this.formModel.pkid,
    };
    this.master.nasPackageMapping(payload).subscribe((res: any) => {
      if (res[0][0][0].status === 1) {
        this.master.toasterSuccessMsg('Mapping inserted successfully!');
        this.modalService.dismissAll();
        this.fetchNASMapping({ id: 0 });
      }
      else {
        this.master.toasterFailureMsg(res[0]?.[0]?.alertmessage || 'Failed.');
      }

    });
  }

  deletenasmapping(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const deleteTarget = { ...parsedRow };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.nasid}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          id: parsedRow.id,
          updatedby: 1
        };
        this.master.deletenasmapping(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0] || res
          if (resultData?.status === 1) {
            this.master.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');
            this.modalService.dismissAll();
            this.dataSource = this.dataSource.filter(item => item.id !== deleteTarget.id);
          }
          else {
            this.master.toasterWarningMsg(resultData?.alertmessage || 'Failed to delete record');
          }
        });
      }
    },
    );
  }



}



