import { Component, inject, TemplateRef, ViewEncapsulation, viewChild, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule, provideFormlyConfig } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { Common } from '../../../services/common';
import { Master } from '../../../services/master';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-city-master',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent, 
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule,],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './city-master.html',
  styleUrl: './city-master.scss'
})
export class CityMaster {


  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [{ field: 'CityName', title: 'City Name' }, { field: 'StateName', title: 'State Name' }, { field: 'activeStatus', title: 'IsActive' }];

  // tableButtons: any = [{lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editDetails', function_parameter_field:'name', btnColor:'btn-outline-primary'},
  // {lable: '<i class="fa fa-eye" aria-hidden="true"></i>', function: 'viewDetails', function_parameter_field:'name', btnColor:'btn-primary'}
  // ];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  @ViewChild('content') content!: TemplateRef<any>;

  ngOnInit() {
    this.getCountriesListForDropdown();
    this.loadFormFields();
    this.getCitiesList();
  }

  updateDropdownOptions(key: string, newOptions: any[]) {
    const targetField = this.getFieldByKey(key, this.formFields);
    if (targetField && targetField.templateOptions) {
      targetField.templateOptions.options = newOptions;
    }
  }

    openCompanyDetailsModal(content: TemplateRef<any>) {
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'xl' });
  }

  getCitiesList() {
    this.dataSource = [];
    this.master.getCitiesList().subscribe((res: any) => {      
      if (res && res.status) {
        if (res.status == 1) {
          this.dataSource = res.data;
        }
        else {

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

    return undefined; // important!
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
  rowSelected: any;
  getSelectedRows(data: any) {
    this.rowSelected = data;
  }

  getTableData(filter: any) {
    this.recordFrom = parseInt(filter.startFrom);
    this.recordLimit = parseInt(filter.limitTo);
  }
  isEditMode: boolean = false;


  editDetails(data: any) {
    this.isEditMode = true;
    this.loadFormFields();
    let cityDetails = JSON.parse(data);
    this.master.getSelectedCityDetails(cityDetails.CityId).subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          let data = res.data[0];
          this.formModel = structuredClone(res.data[0]);
          this.form.setValue(this.formModel);
          this.form.enable();
        }
      }
    });

    this.modalService.open(this.content, { size: 'xl' });
  }

  //To View the Row details
  // viewDetails(data: any)
  // {
  //      let companyDetails = JSON.parse(data);
  //      this.master.getSelectedCityDetails(companyDetails.CompanyId).subscribe((res: any) => {
  //         if(res && res.status)
  //         {
  //             if(res.status == 1)
  //             {
  //                let data = res.data[0];
  //                this.formModel = structuredClone(res.data[0]);
  //                this.form.setValue(this.formModel);
  //               this.form.disable();
  //             }
  //         }
  //   });

  //   this.modalService.open(this.content, { size: 'xl' });
  //   // this.openCompanyDetailsModal(this.content);

  // }

  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  // openCityDetailsModal(content: TemplateRef<any>)
  // {
  //   this.formModel = {};
  //   this.form.reset();
  //   this.modalService.open(content, { size: 'xl' });
  // }

  loadFormFields() {
    this.formFields = [
      {
        key: 'CountryId',
        type: 'select',
        className: 'col-md-6',
        templateOptions: {
          label: 'Country',
          placeholder: 'Select Country',
          options: this.isEditMode ? [] : this.countriesList,
          required: !this.isEditMode,
          valueProp: 'CountryId',
          labelProp: 'CountryName',
          template: '<p>{{ formModel.CountryName }}</p>',
          change: (field, $event) => {
            const selectedValue = field.formControl?.value;
            this.getStatesListForDropdown(selectedValue)
          }
        }
      },
      {
        key: 'StateId',
        type: 'select',
        className: 'col-md-6',
        templateOptions: {
          label: 'State',
          placeholder: 'Select State',
          options: this.isEditMode ? [] : this.statesList,
          labelProp: 'StateName',
          valueProp: 'StateId',
          required: !this.isEditMode,
          template: '<p>{{ formModel.StateName }}</p>'
        },
      },

    ];

    this.formModel = {};
  }



  saveCityDetails(): void {
    if (this.form.invalid) return;
    this.master.saveCityDetails(this.form.value).subscribe((res: any) => {
      console.log(res[0])
      if (res && res[0][0].status) {
        if (res[0][0].status == 1) {
          this.master.toasterSuccessMsg(res[0][0].alertmessage);
          this.modalService.dismissAll();
        }
        else {

        }
      }
    });

  }

}