import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Master } from '../../../services/master';
import Swal from 'sweetalert2';
import { Common } from '../../../services/common';

@Component({
  selector: 'app-firmwaredetails',
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
  templateUrl: './firmwaredetails.html',
  styleUrl: './firmwaredetails.scss'
})
export class Firmwaredetails {
  @ViewChild('addEditFirmwareModal') addEditFirmwareModal!: TemplateRef<any>;

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  isEditMode = false;

  private modalService = inject(NgbModal);
  private masterService = inject(Master);
  private fb = inject(FormBuilder);
  private common = inject(Common);

  tableButtons: any = [
    { lable: '<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>', function: 'editFirmware', function_parameter_field: 'row', btnColor: 'btn-outline-primary' },
    { lable: '<i class="fa-solid fa-trash" aria-hidden="true"></i>', function: 'deleteFirmware', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-outline-danger' }];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  deviceType: string = "BOX";
  PatchisEditConfig: any;
  isVersionUpdate: Number = 2;

  displayedColumns: any = [
    { field: 'ProductName', title: 'Product Name' },
    { field: 'fw_typeName', title: 'Type' },
    // { field: 'fw_type', title: 'Type' },
    // { field: 'Architecture', title: 'Architecture' },
    { field: 'fw_version', title: 'Version' },
    { field: 'hash', title: 'HASH' },
    { field: 'file_url', title: 'File URL' },
    { field: 'descp', title: 'Description' },
    { field: 'forVersions', title: 'For Versions' },
    { field: 'deviceType', title: 'Device Type' },
    { field: 'createdon', title: 'createdon' },
  ];

  ngOnInit(): void {
    this.getFirmwareDetailsList();
    this.newAPFirmwareList();
    this.APProductDropdownList();
    this.loadFormFields();
  }


  getFirmwareDetailsList(reqObj: any = { fw_id: 0 }) {
    this.dataSource = [];
    this.masterService.fetchFirmware(reqObj).subscribe((res: any) => {
      const data = res[0];
      if (Array.isArray(data) && data.length > 0) {
        this.dataSource = data;
        this.originalFilePath = data[0].file_url;
      }
    })
  }

  openFirmwareDetailsModal(content: TemplateRef<any>) {
    this.isEditMode = false;
    // this.PatchisEditConfig = true;
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'lg' });
  }

  firmwareDropdownList: any = [];
  newAPFirmwareList() {
    this.masterService.newAPFirmwareList().subscribe((res: any) => {
      this.firmwareDropdownList = [];
      if (Array.isArray(res[0])) {
        this.firmwareDropdownList = res[0];
        this.loadFormFields();
      }
    });
  }

  FirmwareVersionListFor: any = [];
  APProductDropdownList(reqObj?: any) {
    this.masterService.APProductDropdownList(reqObj).subscribe((res: any) => {
      this.FirmwareVersionListFor = [];
      if (Array.isArray(res[0])) {
        this.FirmwareVersionListFor = res[0];
        this.loadFormFields();
      }
    });
  };


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

  togglechange(status: any): void {
    // console.log("status---->", status);
    this.isVersionUpdate = status
  }

  //            Form Body
  loadFormFields(): void {

    this.formFields = [

      {
        key: 'fw_id',
        type: 'input',
        templateOptions: {
          type: 'hidden',
        },
        //hide: true // Also hides from UI
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'fw_type',
            type: 'checkbox',
            className: 'col-md-6',
            // hideExpression: () => !this.PatchisEditConfig,
            templateOptions: {
              label: 'Version Update',
              indeterminate: false
            },
          },]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'ProductName',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'For AP Type',
              placeholder: 'Select For AP Type',
              options: this.firmwareDropdownList,
              valueProp: 'product',
              labelProp: 'product',
            },
            hooks: {
              onInit: (field: FormlyFieldConfig) => {
                field.formControl?.valueChanges.subscribe((selectedValue) => {
                  console.log("========================================", selectedValue);
                  if (selectedValue) {
                    console.log("=======================IFFFFFFFFF=================", selectedValue);
                    // Only update second dropdown's options
                    this.APProductDropdownList({ ProductName: selectedValue });
                    const fwField = field.parent?.fieldGroup?.find(f => f.key === 'fw_version');
                    if (fwField) {
                      fwField.templateOptions!.options = this.FirmwareVersionListFor || [];
                    }
                  } else {
                    const fwField = field.parent?.fieldGroup?.find(f => f.key === 'fw_version');
                    if (fwField) {
                      fwField.templateOptions!.options = [];
                    }
                  }
                });
              },
            },
          },
          {
            key: 'fw_version',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'For AP Firmware version',
              placeholder: 'Select For AP Firmware version',
              options: [],
              valueProp: 'softwareversion',
              labelProp: 'softwareversion',
            },
          }


        ],
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'hash',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Hash Value',
              type: 'text',
              required: true
            },
          },
          {
            key: 'forVersions',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'New Version',
              type: 'text'
            },
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'descp',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Description',
              type: 'text'
            },
          },
          {
            key: 'file_url',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              type: 'file',
              label: 'File Upload (.img File) ',
              placeholder: 'Upload Logo',
              accept: '.jpg, .png, .jpeg, .bin',
              change: (field, $event) => {
                this.onFileSelected($event);
              },
            },
          },
        ]
      },
    ];
    this.formModel = {};
  }

  originalFilePath: any = '';
  saveFirmwareDetails() {
    if (this.form.invalid) return;

    var natStatus; //= this.isVersionUpdate == true ? 1 : 2;
    if (this.isVersionUpdate)
      natStatus = 2;
    else
      natStatus = 1;

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('Firmware', this.selectedFile);
    }

    if (this.form.get('file_url')?.value == null) {
      formData.append('origninafilepath', this.originalFilePath);
    }

    formData.append('firmwareDetails', JSON.stringify(this.form.value));

    this.masterService.saveFirmware(formData).subscribe(
      (res: any) => {
        const result = res?.[0]?.[0];
        if (result?.status === 1) {
          this.masterService.toasterSuccessMsg(result.alertmessage || 'Firmware added successfully');
          this.modalService.dismissAll();
          this.getFirmwareDetailsList();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || 'Failed to save user');
        }
      });
  }

  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }


  //To View the Row details
  editFirmware(row: any) {
    this.isEditMode = true;
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;

    this.form.reset();
    this.formOptions = {};

    this.originalFilePath = parsedRow.file_url || '';

    this.formModel = {
      fw_id: parsedRow.fw_id,
      ProductName: parsedRow.ProductName || '',
      fw_version: parsedRow.fw_version || '',
      hash: parsedRow.hash || '',
      forVersions: parsedRow.forVersions || '',
      descp: parsedRow.descp || "",
      file_url: "",
    };

    if (parsedRow.file_url) {
      this.common.getFileUrl(parsedRow.file_url).subscribe((blob: any) => {
        this.selectedImageUrl = URL.createObjectURL(blob);
      });
    } else {
      this.selectedImageUrl = '';
    }

    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.addEditFirmwareModal, { size: 'lg' });
    });
  }


  deleteFirmware(row: any): void {
    try {
      if (typeof row === 'string') {
        // Escape backslashes before parsing
        row = row.replace(/\\/g, '\\\\');
        row = JSON.parse(row);
      }
    } catch (e) {
      console.error("Invalid JSON in row:", row, e);
      return;
    }

    const deleteTarget = { ...row, id: row.fw_id };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${row.fw_id}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { fw_id: deleteTarget.fw_id, updatedby: 'admin_user' };

        this.masterService.deleteFirmware(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            this.masterService.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');
            this.getFirmwareDetailsList();
            this.modalService.dismissAll();
          } else {
            this.masterService.toasterWarningMsg(resultData?.alertmessage || 'Failed to delete record');
          }
        });
      }
    });
  }


}
