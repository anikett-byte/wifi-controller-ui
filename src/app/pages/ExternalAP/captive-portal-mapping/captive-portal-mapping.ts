import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Common } from '../../../services/common';
import { Master } from '../../../services/master';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-captive-portal-mapping',
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
  templateUrl: './captive-portal-mapping.html',
  styleUrl: './captive-portal-mapping.scss'
})
export class CaptivePortalMapping implements OnInit {
  @ViewChild('addEditCaptivePortalMapping') addEditCaptivePortalMapping!: TemplateRef<any>;

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
    { lable: '<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>', function: 'editCaptivePortalMapping', function_parameter_field: 'row', btnColor: 'btn-outline-primary' },
    { lable: '<i class="fa-solid fa-trash" aria-hidden="true"></i>', function: 'deleteCaptivePortalMapping', function_parameter_field: '', ft_param_field_vldtn: '', btnColor: 'btn-outline-danger' }];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;


  displayedColumns: any = [
    { field: 'ippoolgateway', title: 'IP Pool Gateway' },
    { field: 'portalname', title: 'Login Page' },
  ];


  ngOnInit(): void {
    const reqObj = { apregid: 0 };
    this.getCaptivePortalMapping(reqObj)

    const reqObjs = { "apregid": 4 };
    this.fetchBindIpoeGateway(reqObjs);

    const reqObjapregid = { apregid: 4 };
    this.fetchBindLoginPage(reqObjapregid);

    this.loadFormFields()
  }


  openCaptivePortalMappingModal(content: TemplateRef<any>) {
    this.isEditMode = false;
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'lg' });
  }

  //  =========================== Get captivePortalMappingList
  getCaptivePortalMapping(reqObj: any) {
    this.masterService.fetchCaptivePortalMapping(reqObj).subscribe((res: any) => {
      if (res[0][0]) {
        this.dataSource = res[0];
        // console.table(this.dataSource)
      }
    });
  }


  // ======================= Bind IPOE Gateway  List================================
  BindIpoeGatewayList = []
  fetchBindIpoeGateway(payload: any): Promise<any> {
    return new Promise((resolve) => {
      this.BindIpoeGatewayList = [];
      this.masterService.fetchBindIpoeGateway(payload).subscribe((res: any) => {
        const data = res[0];
        if (data) {
          this.BindIpoeGatewayList = data;
          this.loadFormFields();
        }
        resolve(data);
      });
    });
  }


  // ======================= Bind Login page List ================================
  fetchBindLoginPageList: any[] = [];
  fetchBindLoginPage(payload: any): Promise<any> {
    return new Promise((resolve) => {
      this.fetchBindLoginPageList = [];
      this.masterService.fetchBindLoginPage(payload).subscribe((res: any) => {
        const data = res[0];
        if (data) {
          this.fetchBindLoginPageList = data;
          this.loadFormFields();
        }
        resolve(data);
      });
    });
  }

  // ======================= Form Body
  loadFormFields(): void {
    this.formFields = [
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            key: 'id',
            type: 'input',
            templateOptions: { type: 'hidden' }
          },
          {
            key: 'ippoolgateway',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'IP Pool Gateway',
              placeholder: '-- Select IP Pool Gateway --',
              options: this.BindIpoeGatewayList,
              valueProp: 'ippoolgateway',
              labelProp: 'ippoolgateway',
              required: true
            },
          },
          {
            key: 'portalname',
            type: 'select',
            className: 'col-md-6',
            templateOptions: {
              label: 'Login Page',
              placeholder: '-- Select Login Page --',
              options: this.fetchBindLoginPageList,
              valueProp: 'loginpage',
              labelProp: 'loginpage',
              required: true,
              change: (_, $event) => {
                const selected = this.fetchBindLoginPageList.find(
                  (item) => item.loginpage === $event.value
                );
                if (selected) {
                  this.formModel.apregid = selected.pdid;
                }
              },
            },
          },
        ]
      }
    ];
    this.formModel = {};
  }



  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  saveCaptivePortalMapping() {
    const payload = { ...this.formModel };

    if (this.formModel.portalname) {
      const selected = this.fetchBindLoginPageList.find(
        (item) => item.loginpage === this.formModel.portalname
      );
      if (selected) {
        payload.apregid = selected.pdid;
      }
    }

    if (this.isEditMode) {
      this.masterService.updateCaptivePortalMapping(payload).subscribe((res: any) => {
        const result = res[0][0][0];
        if (result?.STATUS == 1) {
          this.masterService.toasterSuccessMsg(result?.alertmessage || "Updated successfully.");
          this.modalService.dismissAll();
          this.dataSource = this.dataSource.filter(item => item.id !== result.id);
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || "Update failed.");
        }
      })
    } else {
      this.masterService.savegCaptivePortalMapping(payload).subscribe((res: any) => {
        const result = res[0][0][0];
        if (result?.STATUS == 1) {
          this.masterService.toasterSuccessMsg(result?.alertmessage || 'Saved successfully');
          this.modalService.dismissAll();
          const reqObj = { apregid: 0 };
          this.getCaptivePortalMapping(reqObj)
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || 'Failed to save');
        }
      })
    }
  }


  async editCaptivePortalMapping(row: any) {
    this.isEditMode = true;
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    this.loadFormFields();
    this.formModel = {
      id: parsedRow.id,
      ippoolgateway: parsedRow.ippoolgateway,
      portalname: parsedRow.portalname,
    };

    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.addEditCaptivePortalMapping, { size: 'lg' });
    });
  }


  deleteCaptivePortalMapping(row: any): void {
    const parsedRow = typeof row === "string" ? JSON.parse(row) : row;
    const deleteTarget = {
      ...parsedRow,
      id: parsedRow.id,
    };

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${parsedRow.id}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { id: deleteTarget.id };
        this.masterService.deleteCaptivePortalMapping(payload).subscribe((res: any) => {
          const resultData = res[0][0][0];
          if (resultData.STATUS == 1) {
            this.masterService.toasterSuccessMsg(
              resultData.alertmessage || "Deleted successfully!"
            );
            this.dataSource = this.dataSource.filter(item => item.id !== parsedRow.id);
            this.modalService.dismissAll();
          } else {
            this.masterService.toasterWarningMsg(
              resultData?.alertmessage || "Failed to delete record"
            );
          }
        });


      }
    })
  }

}