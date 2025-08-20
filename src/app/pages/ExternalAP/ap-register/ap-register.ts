import { Component, inject, TemplateRef, ViewEncapsulation, viewChild, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule, provideFormlyConfig } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { Common } from '../../../services/common';
import { Externalap } from '../../../services/externalap';
// import { title } from 'process';

@Component({
  selector: 'app-ap-register',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent,
    CommonModule
  ],
  templateUrl: './ap-register.html',
  styleUrl: './ap-register.scss'
})
export class ApRegister {
  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private external = inject(Externalap);

  rowSelected: any;
  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  clientList: any[] = [];

  displayedColumns: any = [{ field: 'apname', title: 'AP Name' }, { field: 'companyname', title: 'Company Name' },
  { field: 'ctrlurl', title: 'URL' },
  { field: 'macaddress', title: 'MAC Address' }, { field: 'ap_locationname', title: 'Location' },
  { field: 'status', title: 'Status' }
  ];

  tableButtons: any = [
    { lable: '<i class="fa fa-pencil" aria-hidden="true"> </i>', function: 'editAPDetails', function_parameter_field: 'row', btnColor: 'btn-outline-primary' },
  ];


  @ViewChild('content') content!: TemplateRef<any>;
  editMode: any = false;
  ngOnInit() {
    this.form = new FormGroup({});
    this.formOptions = {};
    this.loadFormFields();
    this.fetchAPRegisterDetails();
  }

  loadFormFields() {
    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'companyid',
            type: 'select',
            className: 'col-md-12',
            templateOptions: {
              label: 'Client Name',
              placeholder: 'Select Client',
              options: [],
              valueProp: 'companyid',
              labelProp: 'companyname',
              change: (field, $event) => {
                const selectedValue = field.formControl?.value;
                this.fetchClientList();
              },
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
            key: 'apname',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'AP Name',
              placeholder: 'Enter AP Name',
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
            key: 'macaddress',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'MAC Address',
              placeholder: 'Enter MAC Address',
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
            key: 'ap_locationname',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Location Name',
              placeholder: 'Enter Location Name',
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
            key: 'ctrlurl',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'URL',
              placeholder: 'Enter URL',
              required: true,
              maxLength: 100,
            },
          },
        ]
      }
    ];

    //this.formModel = {};      
  }

  getSelectedRows(data: any) {
    this.rowSelected = data;
  }

  getTableData(filter: any) {
    this.recordFrom = parseInt(filter.startFrom);
    this.recordLimit = parseInt(filter.limitTo);
  }

  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  // --------- CRUD

  fetchAPRegisterDetails(){
      this.external.fetchAPRegisterDetails().subscribe((res: any) => {                   
          if (Array.isArray(res) && Array.isArray(res[0])) {
                const records = res[0];
                if (records[0]?.status === 0) {                    
                    this.external.toasterFailureMsg(records[0].alertmessage);
                } else {
                    this.dataSource = records;         
                }
            }
      })
  }

  openAddAP() {
    this.editMode = false;

    this.formModel = {};
    this.form.reset();
    this.fetchClientList();
    this.modalService.open(this.content, { size: 'xl' });
  }

  editAPDetails(row: any) {
      this.fetchClientList();
      this.editMode = true;      
      const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
                
      this.form.reset(); 
      this.formOptions = {}; 

    this.form.reset();
    this.formOptions = {};

    this.formModel = {
      companyid: parsedRow.companyid || '',
      pdid: parsedRow.pdid || '',
      apname: parsedRow.apname || '',
      macaddress: parsedRow.macaddress || '',
      ap_locationname: parsedRow.ap_locationname || '',
      ctrlurl: parsedRow.ctrlurl || ''
    };

    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.content, { size: 'xl' });
    });
  }

  APRegisterCRUD(): void{
      if(!this.editMode){               
        if (this.form.invalid) return;
          this.external.saveAPRegister(this.form.value).subscribe({
            next:(res: any) => {              
              if(res.length > 0){                  
                   if (res[0].status === 1) {
                        //console.log("FINAL RESULT : ");
                        this.external.toasterSuccessMsg(res[0].alertmessage);
                        this.fetchAPRegisterDetails();
                        this.modalService.dismissAll();                       
                   }
                    else{
                        this.external.toasterFailureMsg(res[0].alertmessage);
                        this.modalService.dismissAll();
                  }
              }
              else{
                  this.external.toasterFailureMsg("Not able to save..");
              }
          }
        })
      }
      else{                                 
          if (this.form.invalid) return;
          this.external.updateAPRegister(this.form.value).subscribe({
            next:(res: any) => {                   
              if(res.length > 0){
                  if (res[0].status === 1) {
                        //console.log("FINAL RESULT : ");
                        this.external.toasterSuccessMsg(res[0].alertmessage);
                        this.fetchAPRegisterDetails();
                        this.modalService.dismissAll();                       
                   }
                    else{
                        this.external.toasterFailureMsg(res[0].alertmessage);
                        this.modalService.dismissAll();
                  }
              }
              else{
                  this.external.toasterFailureMsg("Not able to update..");
              }
            }
          })          
      }      
  }

  updateDropdownOptions(key: string, newOptions: any[]) {
    const targetField = this.getFieldByKey(key, this.formFields);
    if (targetField && targetField.templateOptions) {
      targetField.templateOptions.options = newOptions;
    }
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

  fetchClientList() {
    this.external.fetchClientList().subscribe((res: any) => {
      if (res) {
        this.clientList = res;
        this.updateDropdownOptions('companyid', this.clientList);
      }
    });
  }
}
