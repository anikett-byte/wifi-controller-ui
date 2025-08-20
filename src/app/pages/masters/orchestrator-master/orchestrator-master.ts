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
  selector: 'app-orchestrator-master',
  imports: [FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    // FormlyForm,
    CommonModule,],
  templateUrl: './orchestrator-master.html',
  styleUrl: './orchestrator-master.scss'
})
export class OrchestratorMaster {

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private master = inject(Master);
  private common = inject(Common);

  displayedColumns: any = [{ field: 'name', title: 'Name' }, { field: 'url', title: 'Enter URL' }, { field: 'createdby', title: 'Createdby' }, { field: 'createdon', title: 'CreatedOn' }];

  tableButtons: any = [{ lable: '<i class="fa fa-pencil" aria-hidden="true"></i>', function: 'editOrchDetails', function_parameter_field: '', btnColor: 'btn-outline-primary' }, { lable: '<i class="fa fa-trash" aria-hidden="true"></i>', function: 'deleteOrchestrator', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-danger' }];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;

  @ViewChild('content') content!: TemplateRef<any>;

  ngOnInit() {
    this.loadFormFields();
    this.formModel = {};
    const res = { id: 0 }
    this.fetchOrchestrator(res);
  }
  openCompanyDetailsModal(content: TemplateRef<any>) {
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
    this.formFields = [
      {
        key: 'Id',
        type: 'input',
        templateOptions: {
          type: 'hidden',
        },
      },

      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'name',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Name',
              placeholder: 'Enter Name',
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
            key: 'url', //
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
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'clinetip',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              label: 'Client IP',
              placeholder: 'Enter Client IP',
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
            key: 'isActive', //
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Active'
            },
            expressionProperties: {
              'model.isActive': (model) => !!model.isActive ? 1 : 0,
            },
          },
        ]
      },
    ];
    this.formModel = {};
  }
  editOrchDetails(data: any) {
    let orchDetails = JSON.parse(data);
    // console.log("---->---", orchDetails);
    this.master.getSelectedOrchDetails(orchDetails.id).subscribe((res: any) => {
      // console.log("--------res----->", res);
      if (res && res.status) {
        let data = res.data[0];
        this.formModel = structuredClone(data);
        console.log('------formModel--->', this.formModel)
        this.form.patchValue({
          id: orchDetails.id,
          name: orchDetails.name,
          url: orchDetails.url
        });
        // console.log("from--->", this.form);
        this.form.enable();

      }
    });

    this.modalService.open(this.content, { size: 'xl' });

  }


  fetchOrchestrator(id: any) {
    this.dataSource = [];

    this.master.fetchOrchestrator(id).subscribe((res: any) => {
      console.log('Raw Response:', res);

      if (Array.isArray(res) && Array.isArray(res[0])) {
        const records = res[0];

        if (records[0]?.status == 0) {
          console.warn(records[0].alertmessage); // Not found case
        } else {
          this.dataSource = records;
        }
      } else {
        console.warn("Unexpected response format");
      }
    });
  }
  addOrchestrator() {  //Check this wrong toaster is diplayed but data is getting added
    if (this.form.invalid) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Prepare payload with createdby added explicitly
    // const payload = {
    //   ...this.form.value,
    //     Id: this.rowSelected.id,
    //   createdby: user?.id || null,
    // };
    const payload = this.form.value;
    console.log("---pyop", payload)


    this.master.addOrchestrator(payload).subscribe({
      next: (res: any) => {
        console.log('Add Orchestrator API response:', res);

        // The SP returns nested arrays: res[0][0] is the result object
        const result = Array.isArray(res) && Array.isArray(res[0]) ? res[0][0][0] : res;

        if (result?.status == 1) {
          this.master.toasterSuccessMsg(result.alertmessage)
          this.modalService.dismissAll();

          // Refresh table data after successful insert
          this.fetchOrchestrator({ id: 0 });
        } else {
          this.master.toasterFailureMsg(result.alertmessage);
        }
      },
      error: (err) => {
        console.error('Add Orchestrator error:', err);
        this.master.toasterFailureMsg('Something went wrong while adding orchestrator.');
      }
    });
  }
  updateOrchestrator() {
    if (this.form.invalid) return;
    const payload = {
      ...this.form.value,
      id: this.rowSelected.id,
      createdby: 10
    }
    this.master.updateOrchestrator(payload).subscribe((res: any) => {
      if (res && res[0][0].status === 1) {
        this.master.toasterSuccessMsg(res[0][0].alertmessage);
        this.modalService.dismissAll();
        this.rowSelected = null;
        this.fetchOrchestrator({ id: 0 });
      }
      else {
        alert(res[0][0].alertmessage || 'Failed to update data');
      }

    });
  }




  deleteOrchestrator(orchestrator: any): void {
    const selectedRow = typeof orchestrator === 'string' ? JSON.parse(orchestrator) : orchestrator;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientIp = localStorage.getItem('clientip') || '0.0.0.0';

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${orchestrator.Id}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          id: selectedRow?.id,
          createdby: user?.id || -1,
          clientip: clientIp
        };

        this.master.deleteOrchestrator(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0];
          if (!resultData?.error && resultData) {
            this.master.toasterSuccessMsg(resultData.alertmessage);
            this.modalService.dismissAll();
            this.dataSource = this.dataSource.filter(item => item.id !== selectedRow.id);

          } else {
            this.master.toasterWarningMsg(resultData.alertmessage);
          }
        });
      }
    },
    );
  }
}
