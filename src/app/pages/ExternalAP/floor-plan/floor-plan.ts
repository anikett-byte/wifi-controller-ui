import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import {
  FormlyFieldConfig,
  FormlyForm,
  FormlyFormOptions,
} from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Common } from '../../../services/common';
import { Master } from '../../../services/master';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-floor-plan',
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
  templateUrl: './floor-plan.html',
  styleUrl: './floor-plan.scss',
})
export class FloorPlan implements OnInit {
  isEditMode = false;

  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};

  form: FormGroup = new FormGroup<any>({});
  private modalService = inject(NgbModal);
  private masterService = inject(Master);
  private common = inject(Common);
  private fb = inject(FormBuilder);

  displayedColumns: any = [
    { field: 'floor_plan_name', title: 'Floor Plan Name' },
    { field: 'floor_plan_url', title: 'floor_plan_url' },
    // { field: 'isactive', title: 'IsActive' },
    { field: 'companyId', title: 'Company ID' },
  ];

  tableButtons: any = [
    {
      lable: '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>',
      function: 'ViewFloorPlan',
      function_parameter_field: '',
      btnColor: 'btn-outline-primary',
    },
    {
      lable: '<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>',
      function: 'EditFloorPlan',
      function_parameter_field: 'row',
      btnColor: 'btn-outline-primary',
    },
    {
      lable: '<i class="fa-solid fa-trash" aria-hidden="true"></i>',
      function: 'DeleteFloorPlan',
      function_parameter_field: '',
      ft_param_field_vldtn: '',
      btnColor: 'btn-outline-danger',
    },
  ];

  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;
  recordFrom: Number = 0;
  recordLimit: Number = 10;
  enableCheckbox: Boolean = false;
  originalFilePath: any = '';

  @ViewChild('addEditFloorPlanModal') addEditFloorPlanModal!: TemplateRef<any>;
  @ViewChild('View_Floor_Plan_modal') View_Floor_Plan_modal!: TemplateRef<any>;


  ngOnInit(): void {
    this.getCompaniesListForDropDown();
    const reqObj = { pdid: 0 };
    this.loadFormFields();
    this.getFloorPlan(reqObj);
  }

  getFloorPlan(payload: { pdid: any }) {
    this.dataSource = [];
    this.masterService.fetchExternalFloorPlan(payload).subscribe((res: any) => {
      const data = res[0];
      if (data && data.length > 0) {
        this.dataSource = data;
        this.originalFilePath = data[0].floor_plan_url;
      } else {
        console.warn('No data returned');
      }
    },);
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

  openFloorApModal(content: TemplateRef<any>) {
    this.isEditMode = false;
    this.selectedImageUrl = null;
    this.selectedFile = null;
    this.formModel = {};
    this.form.reset();
    this.modalService.open(content, { size: 'xl' });
  }

  loadFormFields() {
    this.formFields = [
      {
        key: 'floor_plan_id',
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
            key: 'floor_plan_name',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              label: 'Floor Plan Name',
              placeholder: 'Enter floor plan name',
              required: true,
            },
          },
          {
            key: 'isactive',
            type: 'checkbox',
            className: 'col-md-2',
            templateOptions: {
              label: 'Active',
            },
            expressionProperties: {
              'model.isactive': (model, formState) =>
                !!model.isactive ? 1 : 0, // convert 1 → true
            },
          },
          {
            key: 'companyId',
            type: 'select',
            className: 'col-md-4',
            templateOptions: {
              label: 'Parent Company',
              placeholder: 'Select parent company',
              options: this.parentCompaniesList, // Fill dynamically
              valueProp: 'CompanyId',
              labelProp: 'CompanyName',
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'floor_plan_url',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              type: 'file',
              label: 'Floor Plan Image',
              placeholder: 'Upload Logo',
              accept: '.jpg, .png, .jpeg',
              change: (field, $event) => {
                this.onFileSelected($event);
              },
            },
          },
        ],
      },
    ];
    this.formModel = {};
  }


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

  saveFloorPlanDetails() {
    if (this.form.invalid) return;

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('floorPlan', this.selectedFile);
    }

    if (this.form.get('floor_plan_url')?.value == null) {
      formData.append('origninafilepath', this.originalFilePath);
    }

    formData.append('floorPlanDetails', JSON.stringify(this.form.value));

    this.masterService.saveExternalFloorPlan(formData).subscribe((res: any) => {
      const result = Array.isArray(res) && Array.isArray(res[0]) ? res[0][0] : res;
      if (result?.status === 1) {
        this.masterService.toasterSuccessMsg(result?.alertmessage || 'Updated successfully.');
        this.modalService.dismissAll();
        this.getFloorPlan({ pdid: 0 });
      } else {
        this.masterService.toasterWarningMsg(
          'Update failed.'
        );
      }
    });
  }



  EditFloorPlan(row: any) {
    this.isEditMode = true;
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;

    this.form.reset();
    this.formOptions = {};

    this.originalFilePath = parsedRow.floor_plan_url || '';

    this.formModel = {
      floor_plan_name: parsedRow.floor_plan_name || '',
      floor_plan_url: parsedRow.floor_plan_url || '',
      isactive: parsedRow.isactive || '',
      companyId: parsedRow.companyId || '',
      floor_plan_id: parsedRow.floor_plan_id || ""
    };

    if (parsedRow.floor_plan_url) {
      this.common.getFileUrl(parsedRow.floor_plan_url).subscribe((blob: any) => {
        this.selectedImageUrl = URL.createObjectURL(blob);
      });
    } else {
      this.selectedImageUrl = '';
    }

    setTimeout(() => {
      this.form.reset(this.formModel);
      this.modalService.open(this.addEditFloorPlanModal, { size: 'xl' });
    });
  }


  ViewFloorPlan(user: any) {
    this.modalService.open(this.View_Floor_Plan_modal, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }

  triggerRecordOperation(evnt: any) {
    var functionStr = `this.${evnt.operation}('${evnt.field}')`;
    new Function(functionStr).call(this);
  }

  DeleteFloorPlan(row: any): void {
    const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
    const payload = {
      floor_plan_id: parsedRow.floor_plan_id,
      createdby: '',
    };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${parsedRow.floor_plan_id}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.masterService.deleteExternalFloorPlan(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            Swal.fire('Deleted!', resultData.alertmessage || 'Floor plan deleted.', 'success');
            this.getFloorPlan({ pdid: 501003 });
          } else {
            Swal.fire('Error!', resultData?.alertmessage || 'Failed to delete record.', 'error');
          }
        });
      }
    });
  }


}
