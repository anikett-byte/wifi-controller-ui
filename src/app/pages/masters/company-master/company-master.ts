import { Component, inject, TemplateRef, ViewEncapsulation, viewChild, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions, FormlyModule, provideFormlyConfig } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { Common } from '../../../services/common';
import { Master } from '../../../services/master';
import { environment } from '../../../../environments/environment';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-company-master',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule,
    NgbModalModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './company-master.html',
  styleUrl: './company-master.scss'
})
export class CompanyMaster {

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [{ field: 'CompanyName', title: 'Company Name' }, { field: 'CompanyCode', title: 'Company Code' }, { field: 'CompanyEmail', title: 'Company Email' }, { field: 'ContactPerson', title: 'Contact person' }];

  tableButtons: any = [{ lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editDetails', function_parameter_field: '', btnColor: 'btn-outline-primary' }, { lable: '<i class="fa fa-eye" aria-hidden="true"></i>', function: 'viewDetails', function_parameter_field: '', btnColor: 'btn-primary' }, { lable: '<i class="fa fa-trash" aria-hidden="true"></i>', function: 'deleteDetails', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-danger' }];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  @ViewChild('content') content!: TemplateRef<any>;

  ngOnInit() {
    this.getCompaniesListForDropDown();
    this.getCountriesListForDropdown();
    this.loadFormFields();
    this.getCompaniesList();
  }

  updateDropdownOptions(key: string, newOptions: any[]) {
    const targetField = this.getFieldByKey(key, this.formFields);
    if (targetField && targetField.templateOptions) {
      targetField.templateOptions.options = newOptions;
    }
  }

  getCompaniesList() {
    this.dataSource = [];

    //   for(let i = 0 ; i < 200; i++)
    // {
    //   this.dataSource = [... this.dataSource,
    //   {
    //     'name': 'XXXX XXXX XXXXX'+i,
    //     'status': 'Active'
    //   }]
    // }

    this.master.getCompaniesList().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          this.dataSource = res.data;
        }
        else {

        }
      }
    });
  }

  parentCompaniesList: any = [];
  getCompaniesListForDropDown() {
    this.parentCompaniesList = [];
    this.master.getCompaniesListForDropDown().subscribe((res: any) => {
      console.log("=============>re", res);
      if (res && res.status) {
        if (res.status == 1) {
          this.parentCompaniesList = res;
          console.log(this.parentCompaniesList);
        }
      }
    });
  }

  countriesList: any = [];
  getCountriesListForDropdown() {

    this.countriesList = [];
    this.master.getCountriesListForDropdown().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          this.countriesList = res.data;
          this.updateDropdownOptions('CountryId', this.countriesList);
        }
      }
    });
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

  statesList: any = [];
  getStatesListForDropdown(value: any) {
    let coutryId: number = 0;
    coutryId = value;
    this.statesList = [];
    this.master.getStatesListForDropdown(coutryId).subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          this.statesList = res.data;
          this.updateDropdownOptions('StateId', this.statesList);
        }
      }
    });
  }

  citiesList: any = [];
  getCitiesListForDropdown(value: any) {
    let stateId: number = 0;
    stateId = value;
    this.citiesList = [];
    this.master.getCitiesListForDropdown(stateId).subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          this.citiesList = res.data;
          this.updateDropdownOptions('CityId', this.citiesList);
        }
      }
    });
  }

  rowSelected: any;
  getSelectedRows(data: any) {
    this.rowSelected = data;
  }

  getTableData(filter: any) {
    this.recordFrom = parseInt(filter.startFrom);
    this.recordLimit = parseInt(filter.limitTo);
  }

  originalFilePath: any = '';

  editDetails(data: any) {
    let companyDetails = JSON.parse(data);
    this.master.getSelectedCompanyDetails(companyDetails.CompanyId).subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {

          let data = res.data[0];
          this.formModel = structuredClone(res.data[0]);
          this.originalFilePath = res.data[0].logopath;
          this.formModel.logopath = null;
          delete this.formModel.Createdby;
          delete this.formModel.CreatedOn;
          delete this.formModel.ModifiedBY;
          delete this.formModel.ModifiedOn;
          delete this.formModel.clientip;
          this.getStatesListForDropdown(this.formModel.CountryId);
          this.getCitiesListForDropdown(this.formModel.StateId);
          this.form.setValue(this.formModel);
          this.common.getFileUrl(data.logopath).subscribe((blob: any) => {
            this.selectedImageUrl = URL.createObjectURL(blob);
            console.log(this.selectedImageUrl)
          });
          this.form.enable();
          this.modalService.open(this.content, { size: 'xl' });

        }
      }
    });

    // this.openCompanyDetailsModal(this.content);

  }

  //To View the Row details
  viewDetails(data: any) {
    let companyDetails = JSON.parse(data);
    this.master.getSelectedCompanyDetails(companyDetails.CompanyId).subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {

          let data = res.data[0];
          this.formModel = structuredClone(res.data[0]);
          this.originalFilePath = res.data[0].logopath;
          this.formModel.logopath = null;
          delete this.formModel.Createdby;
          delete this.formModel.CreatedOn;
          delete this.formModel.ModifiedBY;
          delete this.formModel.ModifiedOn;
          delete this.formModel.clientip;
          this.getStatesListForDropdown(this.formModel.CountryId);
          this.getCitiesListForDropdown(this.formModel.StateId);
          this.form.setValue(this.formModel);
          this.common.getFileUrl(data.logopath).subscribe((blob: any) => {
            this.selectedImageUrl = URL.createObjectURL(blob);
            console.log(this.selectedImageUrl)
          });

          this.form.disable();

        }
      }
    });

    this.modalService.open(this.content, { size: 'xl' });
    // this.openCompanyDetailsModal(this.content);

  }

  triggerRecordOperation(evnt: any) {
    console.log('Operation triggered:', evnt);
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  openCompanyDetailsModal(content: TemplateRef<any>) {
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'xl' });
  }

  loadFormFields() {
    // Initial load or reload fields from backend (simulate)
    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'CompanyId',
            type: 'input',
            templateOptions: {
              type: 'hidden'
            },
            //hide: true // Also hides from UI
          },
          {
            key: 'CompanyFullName',
            type: 'input',
            className: 'col-md-8',
            templateOptions: {
              label: 'Full Company Name'
            }
          },

          {
            key: 'CompanyCode',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              readonly: true,
              label: 'Company Code',
              placeholder: 'Unique company code'
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'CompanyName',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Short Name'
            }
          },
          {
            key: 'ParentCompanyId',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Parent Company',
              placeholder: 'Select parent company',
              options: this.parentCompaniesList, // Fill dynamically
              valueProp: 'CompanyId',
              labelProp: 'CompanyName',
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'Address',
            type: 'textarea',
            className: 'col-md-12',
            templateOptions: {
              label: 'Address',
              rows: 3
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'CountryId',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: 'Country',
              placeholder: 'Select Company',
              options: [],
              valueProp: 'CountryId',
              labelProp: 'CountryName',
              change: (field, $event) => {
                const selectedValue = field.formControl?.value;
                this.getStatesListForDropdown(selectedValue)
              }
            }
          },
          {
            key: 'StateId',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: 'State',
              placeholder: 'Select State',
              options: [],
              valueProp: 'StateId',
              labelProp: 'StateName',
              change: (field, $event) => {
                const selectedValue = field.formControl?.value;
                this.getCitiesListForDropdown(selectedValue)
              }
            }
          },
          {
            key: 'CityId',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: 'City',
              placeholder: 'Select City',
              options: [],
              valueProp: 'CityId',
              labelProp: 'CityName',
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'PIN',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'PIN / ZIP'
            }
          },
          {
            key: 'Telephone',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Telephone'
            }
          },
          {
            key: 'Fax',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Fax'
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'CompanyEmail',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Official Email',
              type: 'email'
            }
          },
          {
            key: 'PANNo',
            type: 'input',
            className: 'col-md-3',
            templateOptions: {
              label: 'PAN No.'
            }
          },
          {
            key: 'GSTN',
            type: 'input',
            className: 'col-md-3',
            templateOptions: {
              label: 'GSTN'
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'BankId',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Bank',
              options: [],
              valueProp: 'id',
              labelProp: 'name',
            }
          },
          {
            key: 'logopath',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              type: 'file',
              label: 'Company Logo',
              placeholder: 'Upload Logo',
              accept: '.jpg, .png, .jpeg',
              change: (field, $event) => {
                this.onFileSelected($event);
              },
            },

          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'ContactPerson',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Contact Person'
            }
          },
          {
            key: 'Email',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Contact Email',
              type: 'email'
            }
          },
          {
            key: 'ContactPersonNumber',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Contact Number'
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'IsActive',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Active'
            },
            expressionProperties: {
              'model.isActive': (model, formState) => !!model.isActive ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'IsHeadOffice',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Head Office'
            },
            expressionProperties: {
              'model.IsHeadOffice': (model, formState) => !!model.IsHeadOffice ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'IsAllowMac',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Allow MAC'
            },
            expressionProperties: {
              'model.IsAllowMac': (model, formState) => !!model.IsAllowMac ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'IsEmailAuth',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Email OTP'
            },
            expressionProperties: {
              'model.IsEmailAuth': (model, formState) => !!model.IsEmailAuth ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'IsSmsAuth',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'SMS OTP'
            },
            expressionProperties: {
              'model.IsSmsAuth': (model, formState) => !!model.IsSmsAuth ? 1 : 0, // convert 1 → true
            },
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'PartnerType',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Partner Type',
              options: [],
              valueProp: 'id',
              labelProp: 'type'
            }
          },
          {
            key: 'UniID',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Universal ID',
              type: 'number'
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'showfreemac',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Show Free MAC'
            },
            expressionProperties: {
              'model.showfreemac': (model, formState) => !!model.showfreemac ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'locanamoly',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Local Anomaly'
            },
            expressionProperties: {
              'model.locanamoly': (model, formState) => !!model.locanamoly ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'cnsecurity',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'CN Security'
            },
            expressionProperties: {
              'model.cnsecurity': (model, formState) => !!model.cnsecurity ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'ipConfigured',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'IP Configured'
            },
            expressionProperties: {
              'model.ipConfigured': (model, formState) => !!model.ipConfigured ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'smssrv',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'SMS Service'
            },
            expressionProperties: {
              'model.smssrv': (model, formState) => !!model.smssrv ? 1 : 0, // convert 1 → true
            },
          }
        ]
      }
    ];

    this.formModel = {};
  }

  selectedFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

    }
  }

  onValueChange(event: { key: string; value: any }) {
    if (event.key === 'country') {
      this.loadStatesForCountry(event.value);
    }
  }

  loadStatesForCountry(countryCode: string) {
    const states: any = {
      IN: [
        { label: 'Maharashtra', value: 'MH' },
        { label: 'Gujarat', value: 'GJ' },
      ],
      US: [
        { label: 'California', value: 'CA' },
        { label: 'New York', value: 'NY' },
      ],
    };

    const stateField = this.formFields.find(f => f.key === 'state');
    if (stateField) {
      stateField.templateOptions!.options = states[countryCode] || [];
    }
  }

  saveCompanyDetails(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('logoPath', this.selectedFile);
    }

    if (this.form.get('logopath')?.value == null) {
      formData.append('origninalogopath', this.originalFilePath);
    }
    formData.append('companyDetails', JSON.stringify(this.form.value));

    this.master.saveCompanyDetails(formData).subscribe((res: any) => {
      if (res && res[0][0].status) {
        if (res[0][0].status == 1) {
          this.master.toasterSuccessMsg(res[0][0].alert);

          this.modalService.dismissAll();
        }
        else {

        }
      }
    });

  }

  deleteDetails(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const deleteTarget = { ...parsedRow, sid: parsedRow.sid };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.sid}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { sid: deleteTarget.sid, updatedby: 'admin_user', clientip: '' };

        console.log("pending logic");
        // this.masterService.deleteSubscriber(payload).subscribe((res: any) => {
        //   const resultData = res?.[0]?.[0]?.[0];
        //   if (resultData?.status === 1) {
        //     this.masterService.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');
        //     this.getProductClientList();
        //     this.modalService.dismissAll();
        //   } else {
        //     this.masterService.toasterWarningMsg(resultData?.alertmessage || 'Failed to delete record');
        //   }

        // });
      }
    },
    );
  }
}
