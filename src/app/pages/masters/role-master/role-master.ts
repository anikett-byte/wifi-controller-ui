//  We have to get CompanyID from loacalStorage when it will be set - pending for now
//  passing dynamic id for Own Comapny

import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Master } from '../../../services/master';
import { Common } from '../../../services/common';
import { TableComponent } from "../../../shared-components/table/table.component";
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-master',
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
  templateUrl: './role-master.html',
  styleUrl: './role-master.scss'
})
export class RoleMaster {
  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  isEditMode: boolean = false;

  private modalService = inject(NgbModal);
  private masterService = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [
    { field: 'RoleName', title: 'RoleName' },
    { field: 'RoleDescription', title: 'RoleDescription' },
    // { field: 'CompanyId', title: 'CompanyId' },
    { field: 'CompanyName', title: 'Company Name' },
    // { field: 'DepartmentId', title: 'DepartmentId' },
    // { field: 'LevelId', title: 'LevelId' },
    // { field: 'RoleLevel', title: 'RoleLevel' },
    // { field: 'RoleEscalation', title: 'RoleEscalation' },
    // { field: 'IsActive', title: 'IsActive' },
    // { field: 'SystemRole', title: 'SystemRole' },
    // { field: 'servAcc', title: 'servAcc' },
    // { field: 'cngAcc', title: 'cngAcc' },
    // { field: 'clientip', title: 'clientip' },
  ];

  tableButtons: any = [
    {
      lable: '<i class="fa fa-pencil" aria-hidden="true"></i>',
      function: 'editRoleDetails', function_parameter_field: '', btnColor: 'btn-outline-primary'
    },
    {
      lable: '<i class="fa-solid fa-user-gear"></i>',
      function: 'roleRightForUser', function_parameter_field: '', btnColor: 'btn-outline-secondary'
    },
    {
      lable: '<i class="fa-solid fa-trash"></i>',
      function: 'deleteRole', function_parameter_field: '', btnColor: 'btn-outline-danger'
    },
  ];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  @ViewChild('AddEditRoleModal') AddEditRoleModal!: TemplateRef<any>;
  @ViewChild('RoleRightForUser') RoleRightForUser!: TemplateRef<any>;

  ngOnInit() {
    this.loadFormFields();
    this.getCompaniesListForDropDown();
    this.getDepartmentListForDropDown();

    const reqObj = { role_id: 0 };
    this.getRoleList(reqObj);

    this.form.valueChanges.subscribe(val => {
      if (val?.cuser === 'c' && val.companyid) {
        this.loadDepartments(val.companyid);
      } else {
        this.loadDepartments(null);
      }
    });
  }

  localData: any;
  loadDepartments(companyId: any) {
    const finalCompanyId = companyId || this.localData?.cid;
    // this.masterService.getDepartmentRole({
    //   CompanyId: finalCompanyId,
    //   UserId: this.localData?.uid,
    // }).subscribe((res: any) => {

    // });
  }

  getRoleList(reqObj: any) {
    this.dataSource = [];
    this.masterService.fetchRole(reqObj).subscribe((res: any) => {
      if (res[0]) {
        this.dataSource = res[0];
      }
    });
  }

  departmentList: any = [];
  getDepartmentListForDropDown() {
    this.departmentList = [];
    // this.masterService.getCompaniesListForDropDown().subscribe((res: any) => {
    //   if (res && res.status) {
    //     if (res.status == 1) {
    //       this.parentCompaniesList = res.data;
    //       this.loadFormFields();
    //     }
    //   }
    // });
  }

  parentCompaniesList: any = [];
  getCompaniesListForDropDown() {
    this.parentCompaniesList = [];
    this.masterService.getCompaniesListForDropDown().subscribe((res: any) => {
      if (res && res.status) {
        if (res.status == 1) {
          this.parentCompaniesList = res.data;
          this.loadFormFields();
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

  rowSelected: any;
  getSelectedRows(data: any) {
    this.rowSelected = data;
  }

  getTableData(filter: any) {
    this.recordFrom = parseInt(filter.startFrom);
    this.recordLimit = parseInt(filter.limitTo);
  }

  openRoleModal(content: TemplateRef<any>) {
    this.isEditMode = false;
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'lg' });
  }

  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  companyType = [
    { name: 'Own Company', value: 'o' },
    { name: 'Client Company', value: 'c' },
  ];

  loadFormFields() {
    const currentCuser = this.formModel?.cuser ?? 'o';

    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'cuser',
            type: 'radio',
            className: 'col-md-6',
            defaultValue: currentCuser,
            templateOptions: {
              label: 'Role Creation For',
              required: true,
              // disabled: this.isEditMode,
              options: this.companyType.map(ct => ({
                value: ct.value,
                label: ct.name
              })),
            },
            expressionProperties: {
              'templateOptions.disabled': () => this.isEditMode
            }
          },
          {
            key: 'CompanyId',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Select Company',
              placeholder: 'Select Company Name',
              valueProp: 'CompanyId',
              labelProp: 'CompanyName',
              options: this.parentCompaniesList,
            },
            expressionProperties: {
              'templateOptions.disabled': () => this.isEditMode,
              'templateOptions.options': (model: any) => {
                if (model.cuser === 'o') {
                  return this.parentCompaniesList.filter((c: any) => c.CompanyId === 22);
                }
                return this.parentCompaniesList;
              }
            },
            hideExpression: (model: any) => !this.isEditMode && model.cuser === 'o',
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'RoleName',
            type: 'input',
            className: 'col-md-4',
            templateOptions: {
              label: 'Role Name',
              required: true,
              placeholder: 'Enter Role Name',
            },
          },
          {
            key: 'RoleDescription',
            type: 'textarea',
            className: 'col-md-4',
            templateOptions: {
              label: 'Role Description',
              required: true,
              placeholder: 'Enter Role Description',
            },
          }
        ]
      }
    ];
  }

  saveRoleMasterDetails(): void {
    if (this.form.invalid) return;

    const rawFormValue = this.form.getRawValue();

    if (rawFormValue.cuser === 'o') {
      rawFormValue.CompanyId = 22;
    }

    const payload: any = {
      roleid: this.formModel.roleid || 0,
      RoleName: rawFormValue.RoleName,
      RoleDescription: rawFormValue.RoleDescription,
      CompanyId: rawFormValue.CompanyId
    };

    const reqObservable = this.isEditMode
      ? this.masterService.updateRole(payload)
      : this.masterService.saveRole(payload);

    reqObservable.subscribe((res: any) => {
      const result = res?.[0]?.[0]?.[0];

      if (result?.status === 1) {
        const message = this.isEditMode ? 'Updated successfully.' : 'Saved successfully.';
        this.masterService.toasterSuccessMsg(result.alert || message);
        this.modalService.dismissAll();
        this.getRoleList({ role_id: 0 });
      } else {
        this.masterService.toasterFailureMsg(result?.alert || 'Operation failed.');
      }
    });
  }

  editRoleDetails(row: any): void {
    this.isEditMode = true;
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const cuserValue = parsedRow.CompanyId === 22 ? 'o' : 'c';

    this.formModel = {
      ...parsedRow,
      cuser: cuserValue,
      CompanyId: parsedRow.CompanyId
    };
    if (!this.parentCompaniesList || this.parentCompaniesList.length === 0) {
      this.masterService.getCompaniesListForDropDown().subscribe((res: any) => {
        if (res?.status === 1) {
          this.parentCompaniesList = res.data;
          this.loadFormFields();
          this.openEditModal();
        }
      });
    } else {
      this.loadFormFields();
      this.openEditModal();
    }
  }
  openEditModal() {
    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.AddEditRoleModal, { size: 'lg' });
    });
  }

  deleteRole(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const deleteTarget = { ...parsedRow, roleid: parsedRow.roleid };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.roleid}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { id: deleteTarget.roleid, createdby: 1, };
        this.masterService.deleteRole(payload).subscribe((res: any) => {
          ;
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            this.masterService.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');
            this.modalService.dismissAll();
            this.getRoleList({ role_id: 0 });
          } else {
            this.masterService.toasterWarningMsg(resultData?.alertmessage || 'Failed to delete record');
          }
        });
      }
    },
    );
  }


  roleRightForUser(row?: any) {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;

    // You can pass the selected role if needed
    this.rowSelected = parsedRow;

    // Open the modal
    this.modalService.open(this.RoleRightForUser, { size: 'lg' });
  }

}