// import { CommonModule } from "@angular/common";
// import {
//   Component,
//   inject,
//   model,
//   OnInit,
//   TemplateRef,
//   ViewChild,
// } from "@angular/core";
// import {
//   FormBuilder,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
// } from "@angular/forms";
// import { MatButtonModule } from "@angular/material/button";
// import { MatIconModule } from "@angular/material/icon";
// import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
// import {
//   FormlyFieldConfig,
//   FormlyForm,
//   FormlyFormOptions,
// } from "@ngx-formly/core";
// import { TableComponent } from "../../../shared-components/table/table.component";
// import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import { Master } from "../../../services/master";
// import Swal from "sweetalert2";

// @Component({
//   selector: "app-subscriber-master",
//   imports: [
//     MatIconModule,
//     MatButtonModule,
//     TableComponent,
//     FormlyForm,
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     FormlyBootstrapModule,
//   ],
//   templateUrl: "./subscriber-master.html",
//   styleUrl: "./subscriber-master.scss",
// })
// export class SubscriberMaster implements OnInit {
//   @ViewChild("addEditSubscribeModal") addEditSubscribeModal!: TemplateRef<any>;

//   isEditMode = false;
//   formFields: FormlyFieldConfig[] = [];
//   formModel: any = {
//     usertype: "",
//     macaddresses: [],
//     usercount: null,
//     checkboxValue: 2, // default unchecked value
//   };
//   formOptions: FormlyFormOptions = {};
//   form: FormGroup = new FormGroup<any>({});

//   private modalService = inject(NgbModal);
//   private masterService = inject(Master);
//   private fb = inject(FormBuilder);
//   model: any = {
//     usertype: "PPPoE",
//     usercount: 1,
//   };

//   options: FormlyFormOptions = {};

//   tableButtons: any = [
//     {
//       lable: '<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>',
//       function: "editSubscriber",
//       function_parameter_field: "row",
//       btnColor: "btn-outline-primary",
//     },
//     {
//       lable: '<i class="fa-solid fa-trash" aria-hidden="true"></i>',
//       function: "deleteSubscriber",
//       function_parameter_field: "",
//       ft_param_field_vldtn: "",
//       btnColor: "btn-outline-danger",
//     },
//   ];

//   packageList: any = [];
//   dataSource: any[] = [];
//   dataSize: Number = this.dataSource.length;
//   recordFrom: Number = 0;
//   recordLimit: Number = 10;
//   enableCheckbox: Boolean = false;

//   displayedColumns: any = [
//     { field: "username", title: "Username" },
//     { field: "spassword", title: "Password" },
//     // { field: "confirmpassword", title: "Confirm Password" },
//     { field: "usertype", title: "User Type" },
//     { field: "package", title: "Package" },
//     { field: "packageexpiry", title: "Expiry Date" },
//     { field: "ipaddress", title: "IP Address" },
//     { field: "macaddress", title: "MAC Address" },
//     // { field: "firstname", title: "First Name" },
//     // { field: "lastname", title: "Last Name" },
//     // { field: "contactno", title: "Contact No." },
//   ];

//   ngOnInit() {
//     this.getSubscriberList();
//     this.loadFormFields(0);

//     const res = { pkid: 0 };
//     this.fetchPackage(res);
//   }

//   getSubscriberList() {
//     this.dataSource = [];
//     const payload = { sid: 0, companyid: 101 };
//     this.masterService.fetchSubscriber(payload).subscribe((res: any) => {
//       const data = res[0];
//       this.dataSource = data.map((item: any) => {
//         this.displayedColumns.forEach((col: any) => {
//           if (!item[col.field] || item[col.field].toString().trim() === "") {
//             item[col.field] = "-NA-";
//           }
//         });
//         return item;
//       });
//     });
//   }

//   loadFormFields(listOfInputs: number) {
//     this.formFields = this.buildFields(listOfInputs);
//     this.formModel = {};
//   }

//   private buildFields(count: number): FormlyFieldConfig[] {
//     return [
//       {
//         fieldGroupClassName: "row",
//         fieldGroup: [
//           {
//             key: "usertype",
//             type: "select",
//             className: "col-md-3",
//             templateOptions: {
//               label: "User Type",
//               options: [
//                 { label: "PPPoE", value: "PPPoE" },
//                 { label: "IPoE", value: "IPoE" },
//                 { label: "MAC", value: "MAC" },
//                 { label: "Hotspot", value: "Hotspot" },
//                 { label: "BYOD", value: "BYOD" },
//               ],
//             },
//           },
//           {
//             key: "username",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: "User Name",
//               required: true,
//             },
//           },
//           {
//             key: "spassword",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: "Password",
//               type: "password",
//               required: true,
//             },
//           },
//           {
//             key: "confirmpassword",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: "Confirm Password",
//               type: "password",
//               required: true,
//             },
//           },
//         ],
//       },
//       {
//         fieldGroupClassName: "row",
//         fieldGroup: [
//           {
//             key: "ipaddress",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: "IP Address",
//             },
//             expressionProperties: {
//               "templateOptions.required": (model) => model.usertype === "IPoE",
//             },
//             // hideExpression: (model) => model.usertype === "BYOD",
//           },

//           // {
//           //   key: "group_user_id",
//           //   type: "radio",
//           //   className: "col-md-3",
//           //   defaultValue: 0,
//           //   templateOptions: {
//           //     label: "Group",
//           //     required: true,
//           //     options: [
//           //       { value: 1, label: "Active Group" },
//           //       { value: 0, label: "Inactive Group" },
//           //     ],
//           //   },
//           // },
//           // {
//           //   key: "status_flag",
//           //   type: "select",
//           //   className: "col-md-3",
//           //   templateOptions: {
//           //     placeholder: "--- Select Group ---",
//           //     required: true,
//           //     options: [{ value: true, label: "Under implement" }],
//           //   },
//           //   hideExpression: (model) => model.group_user_id !== 1, // hide when inactive
//           // },

//           {
//             fieldGroupClassName: "row",
//             key: "macaddress_default",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: `MAC Address`,
//               // required: true,
//             },
//             // hideExpression: (model) => model?.usertype === "BYOD", // 🔹 condition here
//           },
//           {
//             fieldGroupClassName: "row",
//             // hideExpression: (model) => model?.usertype !== "BYOD",
//             fieldGroup: [
//               {
//                 key: "usercount",
//                 type: "input",
//                 className: "col-md-3",
//                 templateOptions: {
//                   label: "User Count",
//                   required: true,

//                   // options: Array.from({ length: 10 }, (_, i) => ({
//                   //   label: `${i + 1}`,
//                   //   value: i + 1,
//                   // })),
//                 },

//                 // hooks: {
//                 //   onInit: (field) => {
//                 //     field.formControl?.valueChanges.subscribe((newCount) => {
//                 //       this.formFields = this.buildFields(newCount); // 🔹 rebuild entire form config
//                 //     });
//                 //   },
//                 // },
//               },
//             ],
//           },

//         ],
//       },
//       // {
//       //   fieldGroupClassName: "row",
//       //   key: "macaddress",
//       //   fieldGroup: Array.from({ length: count }, (_, i) => ({
//       //     key: `field_${i}`,
//       //     type: "input",
//       //     className: "col-md-3",
//       //     templateOptions: {
//       //       label: `MAC Address ${i + 1}`,
//       //       required: true,
//       //     },
//       //   })),
//       // },
//       {
//         fieldGroupClassName: "row",
//         key: "macaddress",
//         fieldGroup: []
//       },
//       {
//         fieldGroupClassName: "row",
//         fieldGroup: [
//           {
//             key: "firstname",
//             type: "input",
//             className: "col-md-2",
//             templateOptions: {
//               label: "First Name",
//             },
//           },
//           {
//             key: "lastname",
//             type: "input",
//             className: "col-md-2",
//             templateOptions: {
//               label: "Last Name",
//             },
//           },
//           {
//             key: "contactno",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: "Contact No.",
//             },
//           },
//           {
//             key: "address",
//             type: "textarea",
//             className: "col-md-3",
//             templateOptions: {
//               label: "Address",
//             },
//           },
//           {
//             key: "pincode",
//             type: "input",
//             className: "col-md-2",
//             templateOptions: {
//               label: "Pincode",
//               type: "number",
//             },
//           },
//         ],
//       },
//       {
//         fieldGroupClassName: "row",
//         fieldGroup: [
//           {
//             key: "simultanouse_use",
//             type: "input",
//             className: "col-md-3",
//             defaultValue: 1,
//             templateOptions: {
//               label: "Simultaneous Use",
//               type: "number",
//               required: true,
//             },
//             hideExpression: (model) => model.usertype === "BYOD",
//           },
//           {
//             key: "package",
//             type: "select",
//             className: "col-md-3",
//             templateOptions: {
//               label: "Select Package",
//               placeholder: "Select Package",
//               valueProp: "packagename",
//               labelProp: "packagename",
//               options: this.packageList,
//               required: true,
//             },
//           },
//           {
//             key: "amount",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: "Amount",
//               type: "number",
//             },
//           },
//           {
//             key: "packageexpiry",
//             type: "input",
//             className: "col-md-3",
//             templateOptions: {
//               label: "Package Expiry",
//               type: "date",
//               required: true,
//             },
//           },
//         ],
//       },
//     ];
//   }

//   ////////////////////////////   GET package List //////////////////////////////////////////////////////////
//   fetchPackage(reqObj: any) {
//     this.packageList = [];
//     this.masterService.fetchPackage(reqObj).subscribe((res: any) => {
//       if (Array.isArray(res[0])) {
//         this.packageList = res[0];
//       }
//     });
//   }

//   openSubscriberDetailsModal(addEditSubscribeModal: TemplateRef<any>) {
//     this.isEditMode = false;
//     this.formModel = {};
//     this.form.reset();
//     this.modalService.open(addEditSubscribeModal, { size: "xl" });
//   }

//   saveSubscribeDetails(): void {
//     if (this.form.invalid) return;

//     const payload = {
//       ...this.form.value,
//       createdby: 1,
//     };

//     if (this.isEditMode) {
//       this.masterService.updateSubscriber(payload).subscribe((res: any) => {
//         const result = res?.[0]?.[0]?.[0];
//         if (result?.status === 1) {
//           this.masterService.toasterSuccessMsg(
//             result?.alertmessage || "Updated successfully."
//           );
//           this.getSubscriberList();
//           this.modalService.dismissAll();
//         } else {
//           this.masterService.toasterWarningMsg(
//             result?.alertmessage || "Update failed."
//           );
//         }
//       });
//     } else {
//       // CREATE
//       this.masterService.addSubscriber(payload).subscribe((res: any) => {
//         const result = res?.[0]?.[0]?.[0];
//         if (result?.status === 1) {
//           this.masterService.toasterSuccessMsg(
//             result?.alertmessage || "Added successfully."
//           );
//           this.modalService.dismissAll();
//           this.getSubscriberList();
//         } else {
//           this.masterService.toasterWarningMsg(
//             result?.alertmessage || "Update failed."
//           );
//         }
//       });
//       this.loadFormFields(0);
//     }
//   }

//   triggerRecordOperation(evnt: any) {
//     var functionStr = `this.${evnt.operation}('${evnt.field}')`;
//     new Function(functionStr).call(this);
//   }


//   editSubscriber(row: any) {
//     this.isEditMode = true;
//     const parsedRow = typeof row === "string" ? JSON.parse(row) : row;

//     console.log(parsedRow)
//     this.modalService.open(this.addEditSubscribeModal, { size: "xl" });
//     const FormlyInputs: any = {
//       usertype: parsedRow['usertype'],
//       username: parsedRow['username'],
//       spassword: parsedRow['spassword'],
//       confirmpassword: parsedRow['confirmpassword'],
//       ipaddress: parsedRow['ipaddress'],
//       macaddress: parsedRow['macaddress'],
//       usercount: parsedRow['usercount'],
//       firstname: parsedRow['firstname'],
//       lastname: parsedRow['lastname'],
//       contactno: parsedRow['contactno'],
//       address: parsedRow['address'],
//       pincode: parsedRow['pincode'],
//       simultanouse_use: parsedRow['simultanouse_use'],
//       package: parsedRow['package'],
//       amount: parsedRow['amount'],
//       packageexpiry: parsedRow['packageexpiry']
//     }

//     FormlyInputs["macaddress_default"] = null;

//     let macList = parsedRow.macaddress.split(",");


//     for (let i = 0; i < macList.length; i++) {
//       FormlyInputs[`field_${i}`] = macList[i];
//     }

//     this.formFields = this.buildFields(0);

//     // console.log(this.formFields)
//     // this.formOptions = {};
//     // this.formModel = Object.assign({}, FormlyInputs);

//     setTimeout(() => {
//       this.form.setValue(FormlyInputs);
//     }, 1000);
//   }




//   deleteSubscriber(row: any): void {
//     const parsedRow = typeof row === "string" ? JSON.parse(row) : row;
//     const deleteTarget = {
//       ...parsedRow,
//       sid: parsedRow.sid,
//       username: parsedRow.username,
//     };

//     Swal.fire({
//       title: "Are you sure?",
//       text: `You are about to delete "${parsedRow.sid}". This action cannot be undone.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const payload = {
//           sid: deleteTarget.sid,
//           updatedby: "admin_user",
//           clientip: "",
//         };

//         this.masterService.deleteSubscriber(payload).subscribe((res: any) => {
//           const resultData = res?.[0]?.[0]?.[0];
//           if (resultData?.status === 1) {
//             this.masterService.toasterSuccessMsg(
//               resultData.alertmessage || "Deleted successfully!"
//             );
//             this.getSubscriberList();
//             this.modalService.dismissAll();
//           } else {
//             this.masterService.toasterWarningMsg(
//               resultData?.alertmessage || "Failed to delete record"
//             );
//           }
//         });
//       }
//     });
//   }
// }



















import { CommonModule } from "@angular/common";
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TableComponent } from "../../../shared-components/table/table.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Master } from "../../../services/master";
import Swal from "sweetalert2";

@Component({
  selector: "app-subscriber-master",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    TableComponent,
  ],
  templateUrl: "./subscriber-master.html",
  styleUrl: "./subscriber-master.scss",
})
export class SubscriberMaster implements OnInit {
  @ViewChild("addEditSubscribeModal") addEditSubscribeModal!: TemplateRef<any>;

  form!: FormGroup;
  isEditMode = false;

  private fb = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private masterService = inject(Master);

  packageList: any[] = [];
  dataSource: any[] = [];
  dataSize: Number = this.dataSource.length;

  displayedColumns: any = [
    { field: "username", title: "Username" },
    { field: "spassword", title: "Password" },
    { field: "usertype", title: "User Type" },
    { field: "package", title: "Package" },
    { field: "packageexpiry", title: "Expiry Date" },
    { field: "ipaddress", title: "IP Address" },
    { field: "macaddress", title: "MAC Address" },
  ];

  tableButtons: any = [
    {
      lable: '<i class="fa-regular fa-pen-to-square"></i>',
      function: "editSubscriber",
      function_parameter_field: "row",
      btnColor: "btn-outline-primary",
    },
    {
      lable: '<i class="fa-solid fa-trash"></i>',
      function: "deleteSubscriber",
      function_parameter_field: "row",
      btnColor: "btn-outline-danger",
    },
  ];

  ngOnInit() {
    this.initForm();
    this.getSubscriberList();
    this.fetchPackage({ pkid: 0 });


    this.form.get("usertype")?.valueChanges.subscribe((value) => {
      const ipCtrl = this.form.get("ipaddress");

      if (value === "IPoE") {
        ipCtrl?.setValidators([Validators.required]);
      } else {
        ipCtrl?.clearValidators();
      }

      ipCtrl?.updateValueAndValidity();
    });
  }

  initForm() {
    this.form = this.fb.group({
      usertype: ["PPPoE", Validators.required],
      username: ["", Validators.required],
      spassword: ["", Validators.required],
      confirmpassword: ["", Validators.required],
      ipaddress: [""],
      macaddress_default: [""],
      usercount: [1],
      macaddresses: this.fb.array([]), // 🔹 dynamic array
      firstname: [""],
      lastname: [""],
      contactno: [""],
      address: [""],
      pincode: [""],
      simultanouse_use: [1, Validators.required],
      package: ["", Validators.required],
      amount: [""],
      packageexpiry: ["", Validators.required],
    });
  }

  get macaddresses(): FormArray {
    return this.form.get("macaddresses") as FormArray;
  }

  addMacAddress(value: string = "") {
    this.macaddresses.push(this.fb.control(value, Validators.required));
  }

  removeMacAddress(index: number) {
    this.macaddresses.removeAt(index);
  }

  ////////////////////////////   GET Subscriber List //////////////////////////////////////////////////
  getSubscriberList() {
    const payload = { sid: 0, companyid: 101 };
    this.masterService.fetchSubscriber(payload).subscribe((res: any) => {
      const data = res[0];
      this.dataSource = data.map((item: any) => {
        this.displayedColumns.forEach((col: any) => {
          if (!item[col.field] || item[col.field].toString().trim() === "") {
            item[col.field] = "-NA-";
          }
        });
        return item;
      });
    });
  }

  ////////////////////////////   GET package List //////////////////////////////////////////////////
  fetchPackage(reqObj: any) {
    this.masterService.fetchPackage(reqObj).subscribe((res: any) => {
      if (Array.isArray(res[0])) {
        this.packageList = res[0];
      }
    });
  }

  ////////////////////////////   OPEN MODAL //////////////////////////////////////////////////
  openSubscriberDetailsModal(template: TemplateRef<any>) {
    this.isEditMode = false;
    this.form.reset();
    this.macaddresses.clear();
    this.form.patchValue({ usertype: "PPPoE", usercount: 1, simultanouse_use: 1 });
    this.modalService.open(template, { size: "xl" });
  }

  ////////////////////////////   SAVE //////////////////////////////////////////////////
  saveSubscribeDetails(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload = {
      ...formValue,
      macaddress: [
        formValue.macaddress_default,
        ...formValue.macaddresses,
      ].filter(Boolean).join(","), // 🔹 combine into CSV
      createdby: 1,
    };

    if (this.isEditMode) {
      this.masterService.updateSubscriber(payload).subscribe((res: any) => {
        const result = res?.[0]?.[0]?.[0];
        if (result?.status === 1) {
          this.masterService.toasterSuccessMsg(result?.alertmessage || "Updated successfully.");
          this.getSubscriberList();
          this.modalService.dismissAll();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || "Update failed.");
        }
      });
    } else {
      this.masterService.addSubscriber(payload).subscribe((res: any) => {
        const result = res?.[0]?.[0]?.[0];
        if (result?.status === 1) {
          this.masterService.toasterSuccessMsg(result?.alertmessage || "Added successfully.");
          this.modalService.dismissAll();
          this.getSubscriberList();
        } else {
          this.masterService.toasterWarningMsg(result?.alertmessage || "Add failed.");
        }
      });
    }
  }

  ////////////////////////////   EDIT //////////////////////////////////////////////////
  editSubscriber(row: any) {
    this.isEditMode = true;
    const parsedRow = typeof row === "string" ? JSON.parse(row) : row;

    this.form.reset();
    this.macaddresses.clear();

    this.form.patchValue({
      ...parsedRow,
      macaddress_default: null,
    });

    if (parsedRow.macaddress) {
      let macList = parsedRow.macaddress.split(",");
      macList.forEach((mac: string, idx: number) => {
        if (idx === 0) {
          this.form.patchValue({ macaddress_default: mac });
        } else {
          this.addMacAddress(mac);
        }
      });
    }

    this.modalService.open(this.addEditSubscribeModal, { size: "xl" });
  }

  ////////////////////////////   DELETE //////////////////////////////////////////////////
  deleteSubscriber(row: any): void {
    const parsedRow = typeof row === "string" ? JSON.parse(row) : row;
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${parsedRow.sid}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { sid: parsedRow.sid, updatedby: "admin_user", clientip: "" };
        this.masterService.deleteSubscriber(payload).subscribe((res: any) => {
          const resultData = res?.[0]?.[0]?.[0];
          if (resultData?.status === 1) {
            this.masterService.toasterSuccessMsg(resultData.alertmessage || "Deleted successfully!");
            this.getSubscriberList();
            this.modalService.dismissAll();
          } else {
            this.masterService.toasterWarningMsg(resultData?.alertmessage || "Failed to delete record");
          }
        });
      }
    });
  }

  triggerRecordOperation(evnt: any) {
    if (evnt.operation === "editSubscriber") this.editSubscriber(evnt.field);
    if (evnt.operation === "deleteSubscriber") this.deleteSubscriber(evnt.field);
  }
}




