import {
  Component,
  inject,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormlyFieldConfig,
  FormlyForm,
  FormlyFormOptions,
  FormlyModule
} from '@ngx-formly/core';
import {
  Common
} from '../../../services/common';
import {
  Master
} from '../../../services/master';
import {
  CommonModule
} from '@angular/common';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  FormlyBootstrapModule
} from '@ngx-formly/bootstrap';
import {
  TableComponent
} from '../../../shared-components/table/table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-master',
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
  templateUrl: './user-master.html',
  styleUrl: './user-master.scss'
})
export class UserMaster {
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isEditMode = false;
  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};

  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private masterService = inject(Master);
  private common = inject(Common);

  private fb = inject(FormBuilder);

  displayedColumns: any = [{
    field: 'FirstName',
    title: 'Firstname'
  },
  {
    field: 'LastName',
    title: 'Lastname'
  },
  {
    field: 'MobileNo',
    title: 'Mobile No.'
  },
  {
    field: 'OfficeEmailId',
    title: 'Office Email'
  },
  {
    field: 'UserLoginName',
    title: 'Login Email'
  },
  {
    field: 'UserTypeName',
    title: 'User Type'
  },
  {
    field: 'active_status',
    title: 'Status'
  },
  ];

  tableButtons: any = [
    {
      lable: '<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>',
      function: 'editUserDetails',
      function_parameter_field: '',
      btnColor: 'btn-outline-primary'
    },
    {
      lable: '<i class="fa-solid fa-trash" aria-hidden="true"></i>',
      function: 'deleteDetails',
      function_parameter_field: '',
      ft_param_field_vldtn: '',
      btnColor: 'btn-outline-danger'
    }
  ];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  @ViewChild('addEditUserModal') addEditUserModal!: TemplateRef<any>;
  @ViewChild('reset_password_modal') reset_password_modal!: TemplateRef<any>;
  @ViewChild('modalConfirmDelete') modalConfirmDelete!: TemplateRef<any>;

  ngOnInit() {
    this.loadFormFields();
    this.getCompaniesListForDropDown();
    this.getUserList();
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


  getCompaniesListForDropDown() {
    var parentCompaniesList: any = [];
    this.masterService.getCompaniesListForDropDown().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {

          parentCompaniesList = res.data;
          this.updateDropdownOptions('CompanyId', parentCompaniesList);
        }
      }
    });
  }

  getDepartmentListForDropDown() {
    var DepartmentsList = [];
    this.masterService.getDepartmentListForDropDown().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {

          DepartmentsList = res.data;
          this.updateDropdownOptions('DepartmentId', DepartmentsList);
        }
      }
    });
  }

  getRolesListForDropDown() {
    var RolesList = [];
    this.masterService.getRolesListForDropDown().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {

          RolesList = res.data;
          this.updateDropdownOptions('RoleId', RolesList);
        }
      }
    });
  }

  getUserTypeListForDropDown() {
    var userTypesList = [];
    this.masterService.getUserTypeListForDropDown().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {

          userTypesList = res.data;
          this.updateDropdownOptions('RoleId', userTypesList);
        }
      }
    });
  }



  getUserList() {
    this.dataSource = [];
    this.dataSource = [];
    this.masterService.getUserList().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          this.dataSource = res.data[0];
        }
        else {
          this.dataSource = [];
        }
      }
    });
  }


  openUserDetailsModal(content: TemplateRef<any>) {
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, {
      size: 'lg'
    });
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
            key: 'UserId',
            type: 'input',
            templateOptions: {
              type: 'hidden'
            },
            //hide: true // Also hides from UI
          },
          {
            key: 'FirstName',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'First Name',
              required: true,
              maxLength: 100,
            },
          },
          {
            key: 'MiddleName',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Middle Name',
              maxLength: 100,
            },
          },
          {
            key: 'LastName',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Last Name',
              maxLength: 100,
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'Gender',
          type: 'select',
          className: 'col-md-4',
          templateOptions: {
            label: 'Gender',
            options: [{
              value: 'Male',
              label: 'Male'
            },
            {
              value: 'Female',
              label: 'Female'
            },
            {
              value: 'Other',
              label: 'Other'
            },
            ],
          },
        },
        {
          key: 'MaritalStatus',
          type: 'select',
          className: 'col-md-4',
          templateOptions: {
            label: 'Marital Status',
            options: [{
              value: 'Single',
              label: 'Single'
            },
            {
              value: 'Married',
              label: 'Married'
            },
            {
              value: 'Divorced',
              label: 'Divorced'
            },
            ],
          },
        },
        {
          key: 'BloodGroup',
          type: 'select',
          className: 'col-md-4',
          templateOptions: {
            label: 'Blood Group',
            options: [{
              value: 'A+',
              label: 'A+'
            },
            {
              value: 'A-',
              label: 'A-'
            },
            {
              value: 'B+',
              label: 'B+'
            },
            {
              value: 'B-',
              label: 'B-'
            },
            {
              value: 'O+',
              label: 'O+'
            },
            {
              value: 'O-',
              label: 'O-'
            },
            {
              value: 'AB+',
              label: 'AB+'
            },
            {
              value: 'AB-',
              label: 'AB-'
            },
            ],
          },
        },
        ],
      },
      {
        key: 'Address',
        type: 'textarea',
        className: 'col-md-12',
        templateOptions: {
          label: 'Address',
          rows: 3,
        },
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'CompanyId',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Company',
              options: [],
              labelProp: 'CompanyName',
              valueProp: 'CompanyId',
            },
          },
          {
            key: 'DepartmentId',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Department',
              required: false,
              options: [],
              labelProp: 'name',
              valueProp: 'id',
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'RoleId',
          type: 'select',
          className: 'col-md-6',
          templateOptions: {
            label: 'Role',
            options: [],
          },
        },
        {
          key: 'UserTypeId',
          type: 'select',
          className: 'col-md-6',
          templateOptions: {
            label: 'User Type',
            required: false,
            options: [],
          },
        },
        ],
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'DateOfBirth',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            type: 'date',
            required: true,
            label: 'Date of Birth',
          },
        },
        {
          key: 'DateOfJoining',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            type: 'date',
            required: true,
            label: 'Date of Joining',
          },
        },
        ],
      },

      {
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'EmailId',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            type: 'email',
            required: true,
            label: 'Personal Email',
          },
        },
        {
          key: 'OfficeEmailId',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            type: 'email',
            label: 'Office Email',
          },
        },
        ],
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'MobileNo',
          type: 'input',
          className: 'col-md-4',
          templateOptions: {
            type: 'tel',
            required: true,
            label: 'Mobile Number',
          },
        },
        {
          key: 'whatsappNo',
          type: 'input',
          className: 'col-md-4',
          templateOptions: {
            type: 'tel',
            label: 'WhatsApp Number',
          },
        },
        {
          key: 'OfficePhoneNo',
          type: 'input',
          className: 'col-md-4',
          templateOptions: {
            label: 'Office Phone Number',
          },
        },
        ],
      },
      {
        type: 'template',
        template: `
          <div class="col-md-12">
            <hr>
            <h5 class="text-center">Login Details</h5>
          </div>
        `,
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'UserLoginName',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            label: 'User Login Name',
            required: true,
            maxLength: 100,
          },
        },
        {
          key: 'UserPassword',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            label: 'User Password',
            type: 'password',
            required: true,
            placeholder: 'Enter password',
          },
        },
        ],
      }, {
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'IsWebAccess',
          type: 'checkbox',
          className: 'col-md-6',
          templateOptions: {
            label: 'Web Access Allowed?',
          },
        },
        {
          key: 'IsAlertAccess',
          type: 'checkbox',
          className: 'col-md-6',
          templateOptions: {
            label: 'Receive Alerts (Email/SMS)?',
          },
        },
        ],
      },

      {
        type: 'template',
        template: `
          <div class="col-md-12">
            <hr>
          </div>
        `,
      },
      {
        key: 'isActive',
        type: 'checkbox',
        className: 'col-md-12',
        templateOptions: {
          label: 'Is Active?',
        },
      },
    ];

    this.formModel = {};
  }


  saveUserDetails(): void {
    if (this.form.invalid) {
      this.masterService.toasterWarningMsg("Form is invalid");
      return;
    }

    const payload = {
      ...this.form.value,
    };

    this.masterService.addUser(payload).subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          this.masterService.toasterSuccessMsg(res.alertmessage);
          this.modalService.dismissAll();
          this.getUserList();
        } else {
          this.masterService.toasterWarningMsg(res?.alertmessage);
        }
      },
      error: (err) => {
        console.error("Add user error:", err);
        this.masterService.toasterWarningMsg("Something went wrong");
      }
    });

  }


  cleanRecordForForm(data: any): any {
    const cleaned = {
      ...data
    };
    delete cleaned.created_at;
    delete cleaned.clientip;
    delete cleaned.created_by;
    delete cleaned.is_active;
    return cleaned;
  }

  editUserDetails(data: any) {

    let userDetails = JSON.parse(data);

    if (!userDetails || !userDetails.upAutoID) {
      this.masterService.toasterWarningMsg("Invalid user selected.");
      return;
    }
    const payload = {
      id: userDetails.upAutoID,
    };
    this.masterService.getUserDetails(payload).subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          this.openUserDetailsModal(this.addEditUserModal);
          this.formModel = this.common.filterModelByFormFields(res.data[0], this.formFields);
          this.form.setValue(this.formModel);
          this.form.enable(); // Enable if editing is allowed
        }
        else {
          this.dataSource = [];
        }
      }
    });
  }




  deleteDetails(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    console.log(parsedRow);
    const deleteTarget = { ...parsedRow, id: parsedRow.id };
    console.log(deleteTarget);

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.id}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result:any) => {
      if (result.isConfirmed) {
        const payload = {
          id: deleteTarget.id, createdby: 1,
        };
        this.masterService.deleteUser(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            this.masterService.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');

            this.modalService.dismissAll();
          } else {
            this.masterService.toasterWarningMsg(resultData?.alertmessage || 'Failed to delete record');
          }

        });
      }
    })
  }

}
