import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Master } from '../../../services/master';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-code-mapping',
  imports: [
    MatIconModule,
    MatButtonModule,
    TableComponent,
    FormlyForm,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
  ],
  templateUrl: './product-code-mapping.html',
  styleUrl: './product-code-mapping.scss'
})
export class ProductCodeMapping implements OnInit {

  @ViewChild('AssignProductIDModal') AssignProductIDModal!: TemplateRef<any>;
  @ViewChild('GenerateProductIDModal') GenerateProductIDModal!: TemplateRef<any>;

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});

  private modalService = inject(NgbModal);
  private masterService = inject(Master);
  private fb = inject(FormBuilder);

  tableButtons: any = [
    { lable: '<i class="fa-solid fa-xmark" aria-hidden="true"></i>', function: 'discardProductCode', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-outline-danger' }];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  displayedColumns: any = [
    { field: 'boxProductCode', title: 'Box Product Code' },
    { field: 'AssignedTo', title: 'Assigned To' },
    { field: 'AssignedDt', title: 'Assigned Date' },
    { field: 'useStatus', title: 'Use Status' },
    { field: 'usedOn', title: 'Used On' },
    // { field: 'createdBy', title: 'Created By' },
    // { field: 'createdOn', title: 'Created On' },
    // { field: 'updatedby', title: 'Updated By' },
    // { field: 'updatedon', title: 'Updated On' },
    { field: 'clientip', title: 'Client IP' },

  ];

  ngOnInit(): void {
    // this.getUserList()
    // this.dataSource = [
    //   {
    //     boxProductCode: 'BX20250001',
    //     AssignedTo: 1001,
    //     AssignedDt: new Date('2025-06-15'),
    //     useStatus: 1, // Used
    //     usedOn: new Date('2025-06-20'),
    //     createdBy: 501,
    //     createdOn: new Date('2025-05-01'),
    //     updatedby: 502,
    //     updatedon: new Date('2025-06-10'),
    //     clientip: '192.168.101.10',
    //   },
    //   {
    //     boxProductCode: 'BX20250002',
    //     AssignedTo: 0, // unassigned
    //     AssignedDt: null,
    //     useStatus: 0, // UnUsed
    //     usedOn: null,
    //     createdBy: 503,
    //     createdOn: new Date('2025-06-01'),
    //     updatedby: 503,
    //     updatedon: new Date('2025-06-01'),
    //     clientip: '192.168.101.11',
    //   },
    //   {
    //     boxProductCode: 'BX20250003',
    //     AssignedTo: 1002,
    //     AssignedDt: new Date('2025-07-10'),
    //     useStatus: 2, // Discard
    //     usedOn: new Date('2025-07-15'),
    //     createdBy: 504,
    //     createdOn: new Date('2025-06-20'),
    //     updatedby: 505,
    //     updatedon: new Date('2025-07-14'),
    //     clientip: '192.168.101.12',
    //   }
    //   // Add more as required
    // ];
  }

  // getUserList() {
  //   this.dataSource = [];

  //   this.masterService.fetchUser().subscribe({
  //     next: (res: any) => {
  //       console.log("__________________", res);

  //       const data = res[0];

  //       if (data && data.length > 0) {
  //         this.dataSource = data;
  //         console.log("::::::", this.dataSource);
  //       } else {
  //         console.warn('No data returned');
  //       }
  //     },
  //     error: (err) => {
  //       console.error("Error fetching user list:", err);
  //     }
  //   });
  // }


  openProductDetailsModal(content: TemplateRef<any>) {
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'lg' });
  }

  loadFormFields(): void {
    const fieldMap: any = {
      username: {
        type: 'input',
        className: 'col-md-6',
        label: 'Username'
      },
      email: {
        type: 'input',
        className: 'col-md-6',
        label: 'Email',
        inputType: 'email'
      },
      password_hash: {
        type: 'input',
        className: 'col-md-6',
        label: 'Password',
        inputType: 'password'
      },
      is_active: {
        type: 'select',
        className: 'col-md-6',
        label: 'Is Active',
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' }
        ]
      },
      created_by: {
        type: 'input',
        className: 'col-md-6',
        label: 'Created By'
      },
      created_at: {
        type: 'input',
        className: 'col-md-6',
        label: 'Created At',
        inputType: 'datetime-local'
      },
      clientip: {
        type: 'input',
        className: 'col-md-6',
        label: 'Client IP'
      }
    };

    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: this.displayedColumns.map((col: any) => {
          const map = fieldMap[col.field] || {};
          return {
            key: col.field,
            type: map.type || 'input',
            className: map.className || 'col-md-6',
            templateOptions: {
              label: map.label || col.title,
              type: map.inputType || 'text',
              options: map.options || undefined,
              readOnly: ['created_by', 'created_at'].includes(col.field)
            }
          };
        })
      }
    ];

    this.formModel = {
      created_by: 1,
      created_at: new Date().toISOString().slice(0, 16) // for datetime-local input
    };
  }


  saveAssignProduct(): void {
    if (this.form.invalid) {
      this.masterService.toasterWarningMsg("Form is invalid");
      return;
    }
    const payload = {
      ...this.form.value,
      created_by: 1,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ') // format for MySQL
    };
    console.log("Form Payload:", payload);

    this.masterService.productCodeAssignToClient(payload).subscribe({
      next: (res: any) => {
        console.log("Response:", res);
        const result = res?.[0]?.[0];

        if (result?.status === 1) {
          this.masterService.toasterSuccessMsg(result.alertmessage || 'User added successfully');
          this.modalService.dismissAll();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || 'Failed to save user');
        }
      },
      error: (err) => {
        console.error("Add user error:", err);
        this.masterService.toasterWarningMsg("Something went wrong");
      }
    });
  }

  saveGenerateProductID(): void {
    if (this.form.invalid) {
      this.masterService.toasterWarningMsg("Form is invalid");
      return;
    }
    const payload = {
      ...this.form.value,
      created_by: 1,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ') // format for MySQL
    };
    console.log("Form Payload:", payload);

    this.masterService.saveDeviceProductCode(payload).subscribe({
      next: (res: any) => {
        console.log("Response:", res);
        const result = res?.[0]?.[0];

        if (result?.status === 1) {
          this.masterService.toasterSuccessMsg(result.alertmessage || 'User added successfully');
          this.modalService.dismissAll();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || 'Failed to save user');
        }
      },
      error: (err) => {
        console.error("Add user error:", err);
        this.masterService.toasterWarningMsg("Something went wrong");
      }
    });
  }





  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }


  discardProductCode(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const deleteTarget = { ...parsedRow, id: parsedRow.boxProductCode };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.boxProductCode}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { id: deleteTarget.boxProductCode };

        this.masterService.discardDeviceProductCode(payload).subscribe((res: any) => {
          console.log("=======================================>",res);
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            this.masterService.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');
            this.modalService.dismissAll();
          } else {
            this.masterService.toasterWarningMsg(resultData?.alertmessage || 'Failed to delete record');
          }
        });
      }
    },
    );
  }


}
