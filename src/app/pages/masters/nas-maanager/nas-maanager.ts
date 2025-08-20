import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Master } from '../../../services/master';
import { Common } from '../../../services/common';
// import { log } from 'node:console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nas-maanager',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule],
  templateUrl: './nas-maanager.html',
  styleUrl: './nas-maanager.scss'
})
export class NasMaanager {

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [
    { field: 'nasname', title: 'Nas Name' },
    { field: 'nasconectiontype', title: 'NAS ConnectionType' },
    { field: 'isactive', title: 'IsActive' }
  ];

  tableButtons: any = [{ lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editNASDetails', function_parameter_field: 'row', btnColor: 'btn-outline-primary' },
  { lable: '<i class="fa fa-eye" aria-hidden="true"></i>', function: 'viewNasDetails', function_parameter_field: '', btnColor: 'btn-primary' },
  { lable: '<i class="fa fa-trash" aria-hidden="true"></i>', function: 'deleteNAS', function_parameter_field: 'row', ft_param_field_vldtn: '', btnColor: 'btn-danger' }
  ];

  @ViewChild('content') content!: TemplateRef<any>;

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  ngOnInit() {
    const res = { id: 0 }
    this.fetchNAS(res);
    Promise.all([
      this.fetchNASConnectionTypeForDropdown(),
      this.fetchNASTypeForDropdown(),
      this.fetchNASDynamicAttributeForDropdown(),
      this.getCompaniesList()
    ]).then(() => {
      this.loadFormFields();
    })
      .catch((err) => {
        console.error('Error loading dropdowns:', err);
        this.master.toasterFailureMsg('Failed to load form fields. Please try again.');
      });

  }

  connectiontypelist: any = [];
  types: any = [];
  dynamicname: any = [];

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
  openCompanyDetailsModal(content: TemplateRef<any>) {
    this.formModel = {};
    this.form.reset();
    this.form.enable();
    this.modalService.open(content, { size: 'xl' });
  }
  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  editNASDetails(data: any) {
    let nasDetails = JSON.parse(data);
    this.master.getSelectednasDetails(nasDetails.id).subscribe((res: any) => {
      if (res && res.status == 1) {
        let data = res.data[0];
        this.formModel = structuredClone(res.data[0]);
        this.form.patchValue({
          id: nasDetails.id,
          nasname: nasDetails.nasname,
          nasip: nasDetails.nasip,
          nasconectiontype: nasDetails.nasconectiontype,
          nastype: nasDetails.nastype,
          nasdynamicattributename: nasDetails.nasdynamicattributename,
          nasdynamicattributevalue: nasDetails.nasdynamicattributevalue,
          secret: nasDetails.secret,
          packagegroup: nasDetails.packagegroup,
          description: nasDetails.description,
          company: nasDetails.company,
          latitude: nasDetails.latitude,
          longitude: nasDetails.longitude,
          isactive: nasDetails.isactive
        });
        this.form.enable();
        this.modalService.open(this.content, { size: 'xl' });
      }
    });
  }

  viewNasDetails(nasData: any) {
    const parsedRow = typeof nasData === 'string' ? JSON.parse(nasData) : nasData;
    this.master.getSelectednasDetails(parsedRow.id).subscribe((res: any) => {
      console.log("API raw response:", res);
      if (res && res.status === 1) {
        const nasDetails = res.data[0];
        console.log("nasDetails------------->", nasDetails)
        this.formModel = structuredClone(nasDetails);
        this.form.reset();
        this.form.patchValue({
          id: nasDetails.id,
          nasname: nasDetails.nasname,
          nasip: nasDetails.nasip,
          nasconectiontype: nasDetails.nasconectiontype,
          nastype: nasDetails.nastype,
          nasdynamicattributename: nasDetails.nasdynamicattributename,
          nasdynamicattributevalue: nasDetails.nasdynamicattributevalue,
          secret: nasDetails.secret,
          packagegroup: nasDetails.packagegroup,
          description: nasDetails.description,
          company: nasDetails.company,
          latitude: nasDetails.latitude,
          longitude: nasDetails.longitude,
          isactive: nasDetails.isactive
        });
        this.form.disable();
      }
    });

    this.modalService.open(this.content, { size: 'xl' });
  }

  fetchNASConnectionTypeForDropdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.master.fetchNASConnectionTypeForDropdown({}).subscribe((res: any) => {
        const rawData = res?.[0]?.[0];
        console.log('Fetched connection types:', rawData);
        if (Array.isArray(rawData)) {
          this.connectiontypelist = rawData.map((item: any) => ({
            label: item.type,
            value: item.id
          }));
          console.log("connetion",this.connectiontypelist);
        }
        resolve();
      }, reject);
    });
  }

  fetchNASTypeForDropdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.master.fetchNASTypeForDropdown({}).subscribe((res: any) => {
        const rawData = res?.[0]?.[0];
        if (Array.isArray(rawData)) {
          this.types = rawData.map((item: any) => ({
            label: item.type,
            value: item.id.toString()
          }));
        }
        resolve();
      }, reject);
    });

  }

  fetchNASDynamicAttributeForDropdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.master.fetchNASDynamicAttributeForDropdown({}).subscribe((res: any) => {
        const rawData = res?.[0]?.[0];
        if (Array.isArray(rawData)) {
          this.dynamicname = rawData.map((item: any) => ({
            label: item.nasconnection,
            value: item.id.toString()
          }));
        }
        resolve();
      }, reject);
    });
  }

  companylist: any[] = []
  getCompaniesList(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.master.getCompaniesList().subscribe((res: any) => {
        console.log('Company API response:', res);
        const records = res.data;
        if (Array.isArray(records)) {
          this.companylist = records
            .filter((item: any) => item.CompanyName && item.CompanyId)
            .map((item: any) => ({
              label: item.CompanyName,
              value: item.CompanyId.toString()
            }));
          console.log('Companies loaded:', this.companylist);
        } else {
          console.warn('Companies list API returned no data.');
        }
        resolve();
      }, reject);
    });
  }

  loadFormFields() {
    this.formFields = [
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'hidden'
        }
      },
      {
        key: 'nasconectiontype',
        type: 'select',
        className: 'col-md-6',
        templateOptions: {
          label: 'NAS Connection Type',
          placeholder: 'Select Type',
          required: true,
          options: this.connectiontypelist,
          change: (field, $event) => {
            const selected = field.formControl?.value;
            console.log('Selected NAS ConnType:', selected);
          }
        }
      },
      {
        key: 'nasname',
        type: 'input',
        templateOptions: {
          label: 'NAS Name',
          placeholder: 'Enter NAS name',
          required: true
        }
      },
      {
        key: 'nastype',
        type: 'select',
        templateOptions: {
          label: 'NAS Type',
          placeholder: 'Enter NAS type',
          required: true,
          options: this.types,
          change: (field, $event) => {
            const selected = field.formControl?.value;
            console.log('Selected NAS Type:', selected);
          }
        }
      },
      {
        key: 'nasip',
        type: 'input',
        templateOptions: {
          label: 'NAS IP',
          placeholder: 'Enter IP address',
          required: true,
          pattern: '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$'
        }
      },
      {
        key: 'nasdynamicattributename',
        type: 'select',
        templateOptions: {
          label: 'Dynamic Attribute Name',
          options: this.dynamicname,
          placeholder: 'Enter attribute name',
          change: (field, $event) => {
            const selected = field.formControl?.value;
            console.log('Selected NAS Connection Attribute:', selected);
          }
        },
      },
      {
        key: 'nasdynamicattributevalue',
        type: 'input',
        templateOptions: {
          label: 'Dynamic Attribute Value',
          placeholder: 'Enter attribute value'
        }
      },
      {
        key: 'secret',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'Secret',
          placeholder: 'Enter secret',
          required: true
        },
      },
      {
        key: 'packagegroup',
        type: 'input',
        templateOptions: {
          label: 'Package Group',
          placeholder: 'Enter package group (optional)'
        }
      },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          label: 'Description',
          placeholder: 'Enter NAS description'
        }
      },
      {
        key: 'company',
        type: 'select',
        templateOptions: {
          label: 'Company',
          placeholder: 'Enter Company Name',
          options: this.companylist,
          required: true,
          change: (field, $event) => {
            const selected = field.formControl?.value;
            console.log('Selected Company---->:', selected);
          }

        }
      },
      {
        key: 'latitude',
        type: 'input',
        templateOptions: {
          label: 'Latitude',
          placeholder: 'Enter latitude',
          pattern: '^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$'
        }
      },
      {
        key: 'longitude',
        type: 'input',
        templateOptions: {
          label: 'Longitude',
          placeholder: 'Enter longitude',
          pattern: '^[-+]?((1[0-7]\\d)|(\\d{1,2}))(\\.\\d+)?|180(\\.0+)?$'
        }
      },
    ];
    this.formModel = {};
  }

  updateDropdownOptions(key: string, newOptions: any[]) {
    const targetField = this.getFieldByKey(key, this.formFields);
    if (targetField && targetField.templateOptions) {
      targetField.templateOptions.options = newOptions;
    }
  }

  addNas() {
    if (this.form.invalid) return;

    this.master.addNAS(this.form.value).subscribe((res: any) => {
      console.log("Form Data Before Submit:", this.form.value);
      if (res[0][0][0].status === '1') {
        this.master.toasterSuccessMsg(res.alertmessage);
        this.modalService.dismissAll();
        this.fetchNAS({ id: 0 });
        console.log("Submitted Form", this.form.value);
      } else {
        this.master.toasterFailureMsg(res.alertmessage);
      }
    }, err => {
      this.master.toasterFailureMsg('Error while saving NAS');
    });
  }

  fetchNAS(id: any) {
    this.dataSource = [];

    this.master.fetchNAS(id).subscribe((res: any) => {

      try {
        const records = res?.[0]?.[0];
        console.log('Fetched NAS records:', records);
        if (Array.isArray(records) && records.length > 0 && typeof records[0] === 'object') {
          this.dataSource = records;
        } else {
          console.warn('No records found.');
        }
      } catch (e) {
        console.error('Error parsing NAS response:', e);
      }
    });
  }

  deleteNAS(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const deleteTarget = { ...parsedRow, id: parsedRow.id };
    console.log('-----deleteTarget------->', deleteTarget);

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.id}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          id: deleteTarget.id,
          clientip: 1
        };
        this.master.deleteNAS(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0] || res
          if (resultData?.status === 1) {
            this.master.toasterSuccessMsg('Deleted successfully!');
            this.modalService.dismissAll();
            this.dataSource = this.dataSource.filter(item => item.id !== deleteTarget.id);
          } else {
            this.master.toasterWarningMsg('Failed to delete record');
          }
        });
      }
    },
    );
  }
}
