import { Component, inject, TemplateRef, ViewEncapsulation, viewChild, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule, provideFormlyConfig } from '@ngx-formly/core';
import { Common } from '../../../services/common';
import { Master } from '../../../services/master';
import { TableComponent } from '../../../shared-components/table/table.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-master',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule,
  ],
  templateUrl: './menu-master.html',
  styleUrl: './menu-master.scss'
})
export class MenuMaster {
  isEditMode: boolean = false;
  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [{ field: 'MenuName', title: 'Menu Name' }
    // { field: 'MenuURL', title: 'Menu URL' }, { field: 'CntrlName', title: 'ContrlName' },{ field: 'MenuOrder', title: 'Menu Order' },{ field: 'Description', title: 'Description' },{field:'isactive',title:'isactive'}
  ];

  tableButtons: any = [{ lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editDetails', function_parameter_field: '', btnColor: 'btn-outline-primary' }, { lable: '<i class="fa fa-eye" aria-hidden="true"></i>', function: 'menuid', function_parameter_field: 'name', btnColor: 'btn-secondary' }, { lable: '<i class="fa fa-trash" aria-hidden="true"></i>', function: 'deleteMenu', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-danger' }];


  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;


  menuTypes: any[] = [
    { Type: 'master', TypeVal: 'Master Menu' },
    { Type: 'child', TypeVal: 'Child Menu' },
  ];

  @ViewChild('content') content!: TemplateRef<any>;

  ngOnInit() {
    this.loadFormFields();
    this.getMenuesListForDropDown();
    const res = { menuid: 0 }
    this.fetchMenu(res);
    this.updateDropdownOptions('Type', this.menuTypes);
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

  updateDropdownOptions(key: string, newOptions: any[]) {
    const targetField = this.getFieldByKey(key, this.formFields);
    if (targetField && targetField.templateOptions) {
      targetField.templateOptions.options = newOptions;
    }
  }

  openCompanyDetailsModal(content: TemplateRef<any>) {
    this.isEditMode = false;
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'xl' });
  }
  rowSelected: any;
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

  loadFormFields() {
    // Initial load or reload fields from backend (simulate)
    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'menuname',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Menu Name',
              placeholder: 'Enter Menu Name',
              required: true,
              maxLength: 100,
            },
          },
          {
            key: 'ControlName',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Control Name',
              placeholder: 'Enter ControlName',
              required: true,
              maxLength: 100,
            },
          },
          {
            key: 'menuurl',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Menu URL',
              placeholder: 'Enter URL',
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
            key: 'Type',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select Menu Type',
              options: [], // populate dynamically
              valueProp: 'Type',
              labelProp: 'TypeVal',
              change: (field, $event) => {
                const selectedValue = field.formControl?.value;
                // You can handle custom logic here if needed
              }
            }
          },
          {
            key: 'ParentId',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Parent Menu',
              placeholder: 'Select Menu',
              options: [], // populate dynamically
              disabled: true, // will be overridden by expressionProperties
              valueProp: 'MenuId',
              labelProp: 'MenuName',
              change: (field, $event) => {
                const selectedValue = field.formControl?.value;
              }
            },
            expressionProperties: {
              'templateOptions.disabled': `(model.Type != 'child')`,
            },
          }
        ]

      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'Description',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Description',
              placeholder: 'Enter Description',
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
            key: 'CSS',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'CSS Class Name',
              placeholder: 'Enter CSS class Name',
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
            key: 'isdashboard',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Is Dashboard?',
            },
          },
          {
            key: 'iscl',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Is CL?',
            },
          },
          {
            key: 'iscp',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Is CP?',
            },
          },
          {
            key: 'isdi',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Is DI?',
            },
          },
          {
            key: 'isentrypage',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Is Entry Page?',
            },
          },
          {
            key: 'isrt',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Is RT?',
            },
          },
          {
            key: 'sitemap',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Show in Sitemap?',
            },
          },
        ],
      },
    ];

    this.formModel = {};
  }



  getMenuesListForDropDown() {
    this.master.getMenuesListForDropDown().subscribe((res: any) => {

      if (res && res.status) {
        if (res.status == 1) {
          this.updateDropdownOptions('ParentId', res.data);
        }
        else {
          this.updateDropdownOptions('ParentId', []);
        }
      }
      error: (err: any) => {
      }
    });

  }



  fetchMenu(menuid: any) {
    this.dataSource = [];

    this.master.fetchMenu(menuid).subscribe((res: any) => {
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
  saveMenu() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload = {
      menuname: formValue.menuname,
      menuurl: formValue.menuurl || '',
      cntrlname: formValue.cntrlname || '',
      parentid: formValue.parentid || null,
      menuorder: formValue.menuorder || 1,
      orderby: formValue.orderby || 1,
      cssclass: formValue.cssclass || '',
      type: formValue.type || '',
      description: formValue.description || '',
      isdashboard: formValue.isdashboard || false,
      sitemap: formValue.sitemap || false,
      dashboardtype: formValue.dashboardtype || null,
      isdeleted: formValue.isdeleted || false,
      isentrypage: formValue.isentrypage || false,
      iscp: formValue.iscp || false,
      isdi: formValue.isdi || false,
      isrt: formValue.isrt || false,
      iscl: formValue.iscl || false,
      clientip: '::1',
      createdby: 'admin'
    };

    this.master.saveMenu(payload).subscribe((res: any) => {
      if (res && res[0][0][0].status) {
        if (res[0][0][0].status == 1) {
          this.master.toasterSuccessMsg(res[0][0].alertmessage || "Menu Added");
          this.modalService.dismissAll();
        } else {
          this.master.toasterFailureMsg(res[0][0].alertmessage || "Save failed.");
        }
      }
    });
  }





  editDetails(row: any): void {
    this.isEditMode = true;
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    console.log("row---->", parsedRow);
    this.loadFormFields();
    this.form.reset();
    this.formOptions = {};
    this.formModel = Object.assign({}, parsedRow);
    this.form.patchValue(this.form.value);
    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.content, { size: 'lg' });
    });
  }


  deleteMenu(row: any): void {
    console.log("row---->", row);
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    // const deleteTarget = { ...parsedRow, id: parsedRow.id };
    const MenuId = parsedRow.MenuId;
    // console.log('-----deleteTarget------->', deleteTarget);
    console.log('-----row--->', row)


    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.MenuId}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          menuid: MenuId
        };
        this.master.deleteMenu(payload).subscribe((res: any) => {
          console.log("--->res", res);
          const resultData = res?.[0][0] || res
          if (resultData?.status === 1) {
            this.master.toasterSuccessMsg(resultData.alertmessage);
            this.modalService.dismissAll();
            this.dataSource = this.dataSource.filter(item => item.MenuId !== MenuId);
          } else {
            this.master.toasterWarningMsg(resultData.alertmessage);
          }
        });
      }
    },
    );
  }

  //  updateMenu() {
  //   if (this.form.invalid) return;

  //   // Make sure pdid exists for update
  //   if (!this.rowSelected?.pdid) {
  //     alert('No menu selected for update!');
  //     return;
  //   }

  //   const payload = {
  //     ...this.form.value,
  //     pdid: this.rowSelected.pdid,
  //     IsActive: this.form.value.IsActive ? 1 : 0,
  //     IsSystem: this.form.value.IsSystem ? 1 : 0,
  //   };

  //   this.master.updateMenu(payload).subscribe({
  //     next: (res: any) => {
  //       if (res && res[0][0].status === 1) {
  //         this.master.toasterSuccessMsg('Menu updated successfully!');
  //         this.modalService.dismissAll();
  //         this.rowSelected = null;
  //         this.fetchMenu({ v_param: 'FETCH', MenuName: '' });
  //       } else {
  //         this.master.toasterFailureMsg(res[0][0].alertmessage || 'Failed to update menu.');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error:', err);
  //       this.master.toasterFailureMsg('An error occurred while updating menu.');
  //     }
  //   });
  // }
}
