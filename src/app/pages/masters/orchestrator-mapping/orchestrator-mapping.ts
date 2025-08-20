import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Master } from '../../../services/master';
import { TableComponent } from '../../../shared-components/table/table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orchestrator-mapping',
  standalone: true,
  templateUrl: './orchestrator-mapping.html',
  styleUrl: './orchestrator-mapping.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    MatButtonModule,
    MatIconModule,
    TableComponent,
    FormlyForm,
  ],
})
export class OrchestratorMapping implements OnInit {
  @ViewChild('addEditOrchestratorModal') addEditOrchestratorModal!: TemplateRef<any>;

  form: FormGroup = new FormGroup({});
  formModel: any = {};
  formOptions: FormlyFormOptions = {};
  formFields: FormlyFieldConfig[] = [];
  isEditMode = false;
  recordFrom: Number = 0;
  recordLimit: Number = 10;

  tableButtons: any[] = [
    {
      lable: '<i class="fa-regular fa-pen-to-square"></i>',
      function: 'editOrchestratorDetails',
      function_parameter_field: 'row',
      btnColor: 'btn-outline-primary',
    },
    {
      lable: '<i class="fa-solid fa-trash"></i>',
      function: 'deleteOrchestrator',
      function_parameter_field: 'row',
      ft_param_field_vldtn: '',
      btnColor: 'btn-outline-danger',
    },
  ];

  displayedColumns: any[] = [
    { field: 'orc_id', title: 'Orc_id' },
    { field: 'ap_id', title: 'Ap ID' },
    { field: 'device_id', title: 'Device ID' },
    { field: 'CreatedBy', title: 'CreatedBy' },
    { field: 'CreatedOn', title: 'CreatedOn' },
    // { field: 'isactive', title: 'Is Active' },
    { field: 'clientip', title: 'ClientIp' },
  ];

  dataSource: any[] = [];
  dataSize = this.dataSource.length;
  private modalService = inject(NgbModal);
  private masterService = inject(Master);

  ngOnInit(): void {
    this.loadFormFields();
    this.getOrchestratorDetailsList({ orc_id: 0 });
  }

  loadFormFields() {
    this.formFields = [
      {
        key: 'orc_id',
        type: 'input',
        className: 'col-md-6',
        templateOptions: {
          label: 'Orchestrator ID',
          type: 'text',
          disabled: this.isEditMode,
           required: true,
        },
      },
      {
        key: 'ap_id',
        type: 'input',
        className: 'col-md-6',
        templateOptions: {
          label: 'AP ID',
          type: 'text',
          disabled: this.isEditMode,
           required: true,
        },
      },
      {
        key: 'device_id',
        type: 'input',
        className: 'col-md-6',
        templateOptions: {
          label: 'Device ID',
          type: 'text',
        },
      },
    ];
    this.formModel = {};
  }

  getOrchestratorDetailsList(reqObj: any = { orc_id: 0 }) {
    this.dataSource = [];
    this.masterService.fetchOrchestratorMapping(reqObj).subscribe((res: any) => {
      const data = res[0];
      if (Array.isArray(data) && data.length > 0) {
        this.dataSource = data;
      }
    })
  }

  openFirmwareDetailsModal(content: TemplateRef<any>): void {
    this.isEditMode = false;
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'lg' });
  }

  editOrchestratorDetails(row: any): void {
    this.isEditMode = true;
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    this.loadFormFields();
    this.form.reset();
    this.formOptions = {};
    this.formModel = Object.assign({}, parsedRow);
    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.addEditOrchestratorModal, { size: 'lg' });
    });
  }


  saveOrchestratorMapping(): void {
    const payload = { ...this.formModel, createdby: 1 };

    if (this.isEditMode) {
      this.masterService.updateOrchestratorMapping(payload).subscribe((res: any) => {
        const result = res?.[0]?.[0]?.[0];
        if (result?.status === 1 || result?.isactive === 1) {
          this.masterService.toasterSuccessMsg(result?.alertmessage || "Updated successfully.");
          this.modalService.dismissAll();
          this.getOrchestratorDetailsList();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || "Update failed.");
        }
      })
    } else {
      this.masterService.saveOrchestratorMapping(payload).subscribe((res: any) => {
        const result = res?.[0]?.[0]?.[0];
        if (result?.status === 1 || result === 1) {
          this.masterService.toasterSuccessMsg(result?.alertmessage || 'Saved successfully');
          this.modalService.dismissAll();
          this.getOrchestratorDetailsList();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || 'Failed to save');
        }
      })
    }
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


  deleteOrchestrator(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const deleteTarget = { ...parsedRow, id: parsedRow.Id };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.Id}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { id: deleteTarget.Id, createdby: 1, };

        this.masterService.deleteOrchestratorMapping(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            this.masterService.toasterSuccessMsg(resultData.alertmessage || 'Deleted successfully!');
            this.modalService.dismissAll();
            this.getOrchestratorDetailsList();
          } else {
            this.masterService.toasterWarningMsg(resultData?.alertmessage || 'Failed to delete record');
          }
        });
      }
    },
    );
  }
}
