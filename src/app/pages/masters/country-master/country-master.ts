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

@Component({
  selector: 'app-country-master',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent, 
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule,],
  templateUrl: './country-master.html',
  styleUrl: './country-master.scss'
})
export class CountryMaster {

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [{ field: 'CountryId', title: 'Country ID' },{ field: 'CountryName', title: 'Country Name' }, { field: 'CountryCode', title: 'Country Code' }, { field: 'activeStatus', title: 'IsActive' }];

  // tableButtons: any = [{ lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editDetails', function_parameter_field: 'name', btnColor: 'btn-outline-primary' },
    // { lable: '<i class="fa fa-eye" aria-hidden="true"></i>', function: 'viewDetails', function_parameter_field: 'name', btnColor: 'btn-primary' },

    // { lable: 'Delete', function: 'viewDetails', function_parameter_field: 'name', ft_param_field_vldtn: '', btnColor: 'btn-danger' }
  // ];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  @ViewChild('content') content!: TemplateRef<any>;
  ngOnInit() {
    this.getCountriesList();
    this.loadFormFields();
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

  loadFormFields() {
    // Initial load or reload fields from backend (simulate)
    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'CountryName',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Country Name',
              placeholder: 'Enter Country',
              required: true,
              maxLength: 100,
            },
          },
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
            key: 'IsSystem',
            type: 'checkbox',
            className: 'col-md-3',
            templateOptions: {
              label: 'System Defined?',
            },
          },
        ]
      },
    ];



    this.formModel = {};
  }

 getCountriesList() {
    this.dataSource = [];
    this.master.getCountriesList().subscribe((res: any) => {    
      if (res && res.status) {
        if (res.status == 1) {
          this.dataSource = res.data;
        }
        else {

        }
      }
    });
  }

  saveCountryDetails(): void {
    if (this.form.invalid) return;
    this.master.saveCountryDetails(this.form.value).subscribe((res: any) => {      
      if (res && res[0][0].status) {
        if (res[0][0].status == 1) {
          this.master.toasterSuccessMsg(res[0][0].alertmessage);

          this.modalService.dismissAll();
          this.getCountriesList();

        }
        else {

        }
      }
    });

  }
}
