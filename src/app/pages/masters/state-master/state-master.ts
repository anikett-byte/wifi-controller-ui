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
  selector: 'app-state-master',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent, 
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule,],
  templateUrl: './state-master.html',
  styleUrl: './state-master.scss'
})
export class StateMaster {

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [{field: 'StateName', title: 'State Name'}, {field: 'stateCode', title: 'State Code'},{field: 'CountryName', title: 'Country Name'},{field: 'activeStatus', title: 'IsActive'}];

  // tableButtons: any = [{lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editDetails', function_parameter_field:'name', btnColor:'btn-outline-primary'},
    // {lable: '<i class="fa fa-eye" aria-hidden="true"></i>', function: 'viewDetails', function_parameter_field:'name', btnColor:'btn-primary'}
  // ];

  dataSource: any[] = [];
  dataSize:Number = this.dataSource.length;
  recordFrom:Number = 0;
  recordLimit:Number = 10;
  enableCheckbox:Boolean = false;

  @ViewChild('content') content!: TemplateRef<any>;

      ngOnInit() {
      this.getCountriesListForDropdown();
      this.loadFormFields();
      this.getStatesList();
    }
  updateDropdownOptions(key: string, newOptions: any[]) {
      const targetField = this.getFieldByKey(key, this.formFields);
      if (targetField && targetField.templateOptions) {
        targetField.templateOptions.options = newOptions;
      }
    }

getStatesList()
    {
      this.dataSource = [];
      this.master.getStatesList().subscribe((res: any) => {        
          if(res && res.status)
          {
              if(res.status == 1)
              {                
                  this.dataSource = res.data;
              }
              else
              {

              }
          }
    });
    }
    countriesList: any = [];
    getCountriesListForDropdown()
    {
      this.countriesList = [];
      this.master.getCountriesListForDropdown().subscribe((res: any) => {
          if(res && res.status)
          {
              if(res.status == 1)
              {
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

rowSelected:any;
  getSelectedRows(data: any)
  {
    this.rowSelected = data;
  }

  getTableData(filter: any)
  {
      this.recordFrom = parseInt(filter.startFrom);
      this.recordLimit = parseInt(filter.limitTo);
  }

  viewDetails(data: any)
  {
      console.log('Inside View',data);
  }

  triggerRecordOperation(evnt: any)
  {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

    openCompanyDetailsModal(content: TemplateRef<any>)
    {
      this.formModel = {};
      this.form.reset();
      this.modalService.open(content, { size: 'xl' });
    }

    loadFormFields() {
  // Initial load or reload fields from backend (simulate)
  this.formFields =  [
  {
    fieldGroupClassName: 'row',
    fieldGroup: [
      {
        key: 'CountryId',
        type: 'select',
        className: 'col-md-6',
        templateOptions: {
          label: 'Country',
          placeholder: 'Select Country',
          options: [],
          valueProp: 'CountryId',
          labelProp: 'CountryName',
          change: (field, $event)=>{
            const selectedValue = field.formControl?.value;
              this.getCountriesListForDropdown()
          }
        }
      },
    ]
  },
  {
    fieldGroupClassName: 'row',
    fieldGroup: [
      {
        key: 'CityName',
        type: 'input',
        className: 'col-md-12',
        templateOptions: {
          label: 'State Name',
          placeholder: 'Enter State',
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
          'model.isActive': (model, formState) => !!model.isActive?1:0, // convert 1 → true
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
saveStateDetails(): void {
    if(this.form.invalid) return;
    this.master.saveStateDetails(this.form.value).subscribe((res: any) => {
          if(res && res[0][0].status)
          {
              if(res[0][0].status==1)
              {
                this.master.toasterSuccessMsg(res[0][0].alertmessage);
                this.modalService.dismissAll();

              }
              else
              {

              }
          }
    });

  }


}
