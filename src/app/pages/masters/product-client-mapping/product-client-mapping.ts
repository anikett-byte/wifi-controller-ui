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
  selector: 'app-product-client-mapping',
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
  templateUrl: './product-client-mapping.html',
  styleUrl: './product-client-mapping.scss'
})
export class ProductClientMapping implements OnInit {

  @ViewChild('AddEditProductClientModal') AddEditProductClientModal!: TemplateRef<any>;

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  isEditMode = false;

  private modalService = inject(NgbModal);
  private masterService = inject(Master);
  private fb = inject(FormBuilder);


  tableButtons: any = [
    { lable: '<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>', function: 'editProductClient', function_parameter_field: '', btnColor: 'btn-outline-primary' },
    { lable: '<i class="fa-solid fa-trash" aria-hidden="true"></i>', function: 'deleteProductClientMapping', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-outline-danger' }];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  displayedColumns: any = [
    { field: 'ModelId', title: 'Model ID' },
    { field: 'ClientId', title: 'Client ID' },
    { field: 'Address', title: 'Address' },
    { field: 'Zipcode', title: 'Zip Code' },
    { field: 'ProductCode', title: 'Product Code' },
    // { field: 'Latitude', title: 'Latitude' },
    // { field: 'Longitude', title: 'Longitude' },
    // { field: 'CreatedBy', title: 'Created By' },
    // { field: 'CreatedOn', title: 'Created On' },
    // { field: 'ModifiedBy', title: 'Modified By' },
    // { field: 'ModifiedOn', title: 'Modified On' },
    { field: 'SentToDevice', title: 'Sent To Device' },
    { field: 'SentOn', title: 'Sent On' },
    { field: 'IsCurrent', title: 'Is Current' },
    { field: 'CityId', title: 'City ID' },
    { field: 'UserMobile', title: 'User Mobile' },
    { field: 'UserEmail', title: 'User Email' },
    { field: 'clientip', title: 'Client IP' }
  ];

  ngOnInit() {
    this.loadFormFields();
    this.getProductClientList();
  }

  getProductClientList() {
    this.dataSource = [];
    this.masterService.fetchProductClientMapping().subscribe((res: any) => {
      const data = res[0];
      if (data && data.length > 0) {
        this.dataSource = data;
      } else {
        console.warn('No data returned');
      }
    });
  }

  getTableData(filter: any) {
    this.recordFrom = parseInt(filter.startFrom);
    this.recordLimit = parseInt(filter.limitTo);
  }

  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  loadFormFields(): void {
    this.formFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'ModelId',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              required: true,
              label: 'Model ID',
              type: 'text'
            }
          },
          {
            key: 'ClientId',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              required: true,
              label: 'Client ID',
              type: 'text'
            }
          },
          {
            key: 'Address',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Address',
              type: 'text'
            }
          },
          {
            key: 'Zipcode',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Zip Code',
              type: 'text'
            }
          },
          {
            key: 'ProductCode',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              required: true,
              label: 'Product Code',
              type: 'text'
            }
          },
          {
            key: 'Latitude',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Latitude',
              type: 'text'
            }
          },
          {
            key: 'Longitude',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Longitude',
              type: 'text'
            }
          },
          {
            key: 'SentToDevice',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Sent To Device',
              required: true,
              options: [
                { value: 1, label: 'Yes' },
                { value: 0, label: 'No' }
              ]
            }
          },
          {
            key: 'CityId',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'City ID',
              type: 'text'
            }
          },
          {
            key: 'UserMobile',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'User Mobile',
              type: 'text'
            }
          },
          {
            key: 'UserEmail',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'User Email',
              type: 'email'
            }
          },
        ]
      }
    ];

    this.formModel = {}
  }

  openProductClientMappingModal(AddProductModal: TemplateRef<any>) {
    this.isEditMode = false;
    this.formModel = {};
    this.form.reset();
    this.modalService.open(AddProductModal, { size: 'lg' });
  }

  saveProductClientMapping(): void {
    if (this.form.invalid) {
      this.masterService.toasterWarningMsg("Form is invalid");
      return;
    }

    const payload = { ...this.form.value, };

    if (this.isEditMode) {
      this.masterService.updateProductClientMapping(payload).subscribe((res: any) => {
        const result = res?.[0]?.[0]?.[0];
        if (result?.status === 1) {
          this.masterService.toasterSuccessMsg(result.alertmessage || 'Product added successfully');
          this.modalService.dismissAll();
          this.getProductClientList();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || 'Failed to save Product');
        }
      });
    } else {
      this.masterService.saveProductClientMapping(payload).subscribe((res: any) => {
        const result = res?.[0]?.[0]?.[0];
        if (result?.status === 1) {
          this.masterService.toasterSuccessMsg(result.alertmessage || 'Product added successfully');
          this.modalService.dismissAll();
          this.getProductClientList();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || 'Failed to save Product');
        }
      });
    }
  }

  editProductClient(row: any) {
    this.isEditMode = true;
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;

    this.form.reset();
    this.formOptions = {};
    this.formModel = Object.assign({}, parsedRow);

    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.AddEditProductClientModal, { size: 'lg' });
    });
  }

  deleteProductClientMapping(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const deleteTarget = { ...parsedRow, mapid: parsedRow.MapId };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.MapId}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { mapid: deleteTarget.mapid, updatedby: 'admin_user', clientip: '' };

        this.masterService.deleteProductClientMapping(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            this.masterService.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');
            this.getProductClientList();
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
