// import {
//   Component,
//   OnInit,
//   ViewChild,
//   ElementRef,
//   Renderer2,
//   ComponentFactoryResolver,
//   ComponentRef,
//   ViewContainerRef,
//   Input,
// } from "@angular/core";
// import { FloorPlanPinComponent } from "../floor-plan-pin/floor-plan-pin.component";
// import {
//   FormGroup,
//   FormBuilder,
//   Validators,
//   FormControl,
//   FormArray,
// } from "@angular/forms";
// import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
// import { Router, ActivatedRoute } from "@angular/router";
// // import { LocalStoreService } from "src/app/shared/services/local-store.service";
// import { environment } from "../../../../../environments/environment";
// import { Master } from "../../../../services/master";

// @Component({
//   selector: "app-view-floor-plan",
//   templateUrl: "./view-floor-plan.component.html",
//   styleUrls: ["./view-floor-plan.component.scss"],
//   standalone: true
// })
// export class ViewFloorPlanComponent implements OnInit {
//   @Input() floorplanid: any;
//   @ViewChild("tipContent") tooltip?: NgbTooltip;
//   fpImageUrl: string =
//     "http://apcontroller.cnergeecloud.com/FloorPlan/city194324.png";
//   showDelete: any = false;
//   test: any;
//   /* inBounds = true;
//    edge = {
//      top: true,
//      bottom: true,
//      left: true,
//      right: true,
//    };*/

//   inBounds = true;
//   myOutOfBounds = {
//     top: false,
//     right: false,
//     bottom: false,
//     left: false
//   };
//   edge = {
//     top: true,
//     bottom: true,
//     left: true,
//     right: true
//   };

//   floorPlanId: any;
//   selectAPid: any;
//   availableDeviceList: any = [];
//   pinnedDeviceList: any;
//   floorPlanName: any;
//   apData: any;
//   apMac: any;
//   apName: any;
//   tempApData: any;
//   checkTable1: any;
//   table1List: any;
//   checkTable2: any;
//   table2List: any;
//   isdraggable: boolean = false;
//   currentLeft: any;
//   currentTop: any;
//   cid: any;
//   APdeleteList: any = [];
//   deleteAPdata: any = {};
//   action = '';
//   floor_plan_url = '';
//   constructor(
//     private manageModalService: NgbModal,
//     private router: Router,
//     private CFR: ComponentFactoryResolver,
//     public masterService: Master,
//     // private localStorage: LocalStoreService,
//   ) {
//     var imgUrl: any = [];
//     var baseUrl: string = environment.baseUrl;
//     if (baseUrl.indexOf("/api") > -1) imgUrl = baseUrl.split("/api");
//     else if (baseUrl.indexOf("/Api") > -1) imgUrl = baseUrl.split("/Api");
//     if (!this.floor_plan_url)
//       this.floor_plan_url = '';
//     this.fpImageUrl =
//       imgUrl[0].toString() +
//       this.floor_plan_url.replace("~", "");

//     this.dropdownSettings = {
//       singleSelection: true,
//       idField: "apid",
//       textField: "gw_id",
//       selectAllText: "Select All",
//       unSelectAllText: "UnSelect All",
//       itemsShowLimit: 3,
//       allowSearchFilter: true,
//     };
//   }

//   pins: any = [];
//   componentsReferences = [];
//   managePinForm?: FormGroup;
//   deviceList: any = [
//     {
//       id: "0",
//       ap_Name: "AP 1",
//       gw_address: "103.54.183.152",
//       gw_id: "d4:45:e8:b7:1c:d6",
//       uptime: "2.39 pm",
//       status: "ONLINE",
//       channel: "SINGLE",
//       wlan_channel2g: "",
//       wlan_channel5g: "",
//     },
//     {
//       id: "1",
//       ap_Name: "AP 2",
//       gw_address: "103.54.183.152",
//       gw_id: "d5:45:e8:b7:1c:d6",
//       uptime: "2.39 pm",
//       status: "ONLINE",
//       channel: "DUAL",
//       wlan_channel2g: "",
//       wlan_channel5g: "",
//     },
//   ];

//   validationMessage = {
//     floorPlanName: [
//       { type: "required", message: "Floor plan name is required" },
//       { type: "minlength", message: "At least 2 characters are required" },
//       { type: "maxlength", message: "A maximum of 25 characters is allowed" },
//     ],
//     deviceListId: [
//       { type: "required", message: "Please select a device from the list" },
//       { type: "minlength", message: "At least 2 characters are required" },
//       { type: "maxlength", message: "A maximum of 25 characters is allowed" },
//     ],
//   };
//   selectedItems = [];
//   dropdownSettings = {};
//   get details() {
//     return this.managePinForm?.controls;
//   }

//   onItemSelect(ap: any) {
//     this.apData = [];
//     this.selectAPid = ap.gw_id;
//     this.apData = this.availableDeviceList.find((x: any) => x.apid == ap.apid);
//   }
//   onSelectAll(items: any) {
//   }

//   @ViewChild("viewContainerRef", { read: ViewContainerRef })
//   VCR?: ViewContainerRef;
//   ngOnInit() {
//     // this.cid = this.localStorage.getItem("data_unkwn").cid;
//     this.getAvailableApForFP();
//   }

//   getAvailableApForFP() {
//     this.selectedItems = [];
//     var reqObj = {
//       // pdid: this.localStorage.getItem("m_id"),
//       // floorplanid: this.floorPlanId,
//       // companyid: this.cid,
//     };
//     if (this.floorPlanId == undefined || this.floorPlanId == "")
//       this.router.navigate(["ap-controller/add-floor-plan"]);
//     this.masterService.fetchExternalFloorPlan(reqObj)
//       .subscribe((res: any) => {

//         res = JSON.parse(res);
//         this.table1List = res.Table1;
//         this.table2List = res.Table2;
//         this.pins = [];
//         var data = res.Table2;
//         for (var i = 0; i < data.length; i++) {
//           if (data[i].top == null && data[i].left == null) {
//             data[i].top = 50;
//             data[i].left = 50;
//           }
//           var aptempApData = {
//             mac: data[i].gw_id,
//             product_name: data[i].product_name,
//             left: data[i].left,
//             top: data[i].top,
//             floorplanid: data[i].floor_plan_id,
//             apid: data[i].apid,
//             createdby: data[i].created_by,
//             ctrl_compid: data[i].ctrlcompanyId1,
//             is_pinned: data[i].is_pinned,
//             status: data[i].status,
//             user_count: data[i].user_count,
//             uptime: data[i].uptime,
//             ap_name: data[i].ap_name,
//             upload: data[i].upload,
//             download: data[i].download,
//           };

//           this.pins.push(aptempApData);
//         }

//         if (this.pins.length == 0) {
//           this.availableDeviceList = res.Table1;
//         } else {

//           this.availableDeviceList = res.Table1;
//           for (var i = 0; i < this.pins.length; i++) {
//             if (this.pins[i].is_pinned != 1) {
//               var id = this.pins[i].apid;
//               this.availableDeviceList = this.availableDeviceList.filter(
//                 function (item: any) {
//                   //i
//                   return item.apid !== id;
//                 }
//               ); // commented here by Rajani Karthik wrong apid is picked
//             }
//           }
//         }

//       });
//   }

//   openModel(managePin: any) {
//     this.getAvailableApForFP();
//     this.managePinForm = new FormGroup({
//       //Group config
//       floorPlanName: new FormControl(this.floorPlanName, [Validators.required]),
//       deviceListId: new FormControl("", [Validators.required]),
//     });
//     this.manageModalService.open(managePin, {
//       ariaLabelledBy: "modal-basic-title",
//       size: "lg",
//       backdrop: true,
//       keyboard: false,
//       centered: true,
//     });
//   }

//   showData() {
//     this.manageModalService.dismissAll();
//   }
//   addAp() {

//     this.tempApData = {
//       mac: this.apData.gw_id,
//       product_name: this.apData.product_name,
//       left: 50,
//       top: 50,
//       floorplanid: this.floorPlanId,
//       apid: this.apData.apid,
//       createdby: 1,
//       ctrl_compid: this.cid,
//       is_pinned: 0,
//       ap_name: this.apData.ap_name,
//       status: this.apData.status,
//       upload: this.apData.upload,
//       download: this.apData.download,
//       user_count: this.apData.user_count,
//       uptime: this.apData.uptime
//     };
//     this.pins.push(this.tempApData);

//   }
//   removeAp(data: any) {
//     var tempId = data.mac; //this.tempApData.apid
//     this.pins = this.pins.filter(function (item:any) {
//       return item.mac !== tempId;
//     });
//   }
//   saveFloorPlanAp() {
//     if (this.deleteAPdata) {
//       var reqObj1 = {
//         floorplanid: this.deleteAPdata.floorplanid,
//         apid: this.deleteAPdata.apid,
//         createdby: this.deleteAPdata.createdby,
//         ctrl_compid: this.deleteAPdata.ctrl_compid,
//       };
//       this.masterService.deleteExternalFloorPlanPin(reqObj1)
//         .subscribe((res: any) => {
//           //    this.getAvailableApForFP();
//         });


//       this.deleteAPdata = {};
//     }
//     var reqObj = {
//       pin_lst: this.pins,
//     };
//     this.masterService
//       .saveExternalFloorPlanPin(reqObj)
//       .subscribe((res: any) => {
//         this.getAvailableApForFP();

//         if (res[0].STATUS == 1) {
//           //setTimeout(() => {
//           this.masterService.toasterSuccessMsg(res[0].alertmessage);
//           //}, 0);

//           this.manageModalService.dismissAll();
//           this.ngOnInit();
//         } else {
//           setTimeout(() => {
//             this.masterService.toasterFailureMsg(res[0].alertmessage);
//           }, 0);
//           this.ngOnInit();
//         }
//       });



//   }
//   deleteFloorPlanAp(apId: any) {
//     var reqObj = {
//       floorplanid: this.floorPlanId,
//       apid: apId,
//       createdby: 1,
//       pdid: this.cid,
//     };

//   }
//   addPin() {
//     this.createComponent(50, 50);
//   }
//   count: any = 0;
//   createComponent(x: any, y: any) {
//     this.count++;
//     let componentFactory = this.CFR.resolveComponentFactory(
//       FloorPlanPinComponent
//     );
//     let componentRef: ComponentRef<FloorPlanPinComponent> =
//       this.VCR.createComponent(componentFactory);
//     let currentComponent = componentRef.instance;

//     currentComponent.selfRef = currentComponent;
//     //currentComponent.index = ++this.index;
//     currentComponent.x = x;
//     currentComponent.y = y;
//     currentComponent.name = "AP " + this.count;
//     currentComponent.ref = this.VCR.element.nativeElement;
//     //(<DynamicDraggableComponent>componentRef.instance).bounds = this.VCR.
//     // prividing parent Component reference to get access to parent class methods
//     //currentComponent.compInteraction = this;

//     // add reference for newly created component
//     this.componentsReferences.push(componentRef);
//   }
//   redirectToFloorPlan() {
//     this.router.navigate(["/ap-controller/add-floor-plan"]);
//   }
//   redirectToMap() {
//     this.router.navigate(["/ap-controller/google-map"]);
//   }

//   //***************************
//   onStart(event: any) {
//     this.isdraggable = true;

//   }

//   onStop(event: any) {
//     //this.position = { x: this.x, y: this.y };
//     this.isdraggable = false;
//   }

//   onMoving(event: any) {
//     // this.movingOffset.x = event.x;
//     ///this.movingOffset.y = event.y;
//   }

//   onMoveEnd(event: any, apData: any) {
//     var index = this.pins.findIndex((item: any) => item.apid === apData.apid);
//     this.pins[index].top = event.y;
//     this.pins[index].left = event.x;
//     this.currentLeft = event.x;
//     this.currentTop = event.y;
//   }
//   getApData(event: any, position: any) {
//   }
//   checkEdge(event: any) {
//     this.edge = event;
//   }
//   apAction(p: any) {
//     if (p.is_pinned == 1) {
//       this.deleteAp(p);
//     } else {
//       this.removeAp(p);
//     }
//     this.tempApData = p;
//     this.apMac = p.mac;
//     this.apName = p.product_name;
//     //this.tooltip.open()
//     // if (this.tooltip.isOpen()) {
//     //   this.tooltip.close();
//     // } else {
//     //   this.tooltip.open();
//     // }
//   }
//   deleteAp(data: any) {
//     /*var reqObj = {
//       floorplanid: data.floorplanid,
//       apid: data.apid,
//       createdby: data.createdby,
//       ctrl_compid: data.ctrl_compid,
//     };
//     this.apControllerService
//       .apFloorPlanPinDelete(reqObj)
//       .subscribe((res: any) => {
//         this.getAvailableApForFP();
//       });*/
//     //    this.removeAp(data)

//     this.APdeleteList.push(data.apid)
//     var tempId = data.mac; //this.tempApData.apid
//     this.pins = this.pins.filter(function (item: any) {
//       return item.mac !== tempId;
//     });
//     this.deleteAPdata = data
//   }
//   showApConfig(apid: any) {
//     if (this.isdraggable) return false;
//     var sendData;
//     this.checkTable1 = this.table1List.find(function (item: any) {
//       return item.id == apid;
//     });
//     this.checkTable2 = this.table2List.find(function (item: any) {
//       return item.id == apid;
//     });
//     if (this.checkTable1 != undefined) {
//       sendData = this.checkTable1;
//     } else if (this.checkTable2 != undefined) {
//       sendData = this.checkTable2;
//     }

//     //******* */
//     var checkToClick = this.pins.find(function (item: any) {
//       return item.apid == apid;
//     });
//     //****** */
//     //if(checkToClick.left != sendData.left && checkToClick.top != sendData.top){
//     if (
//       checkToClick.left != this.currentLeft &&
//       checkToClick.top != this.currentTop
//     ) {
//     } else if (
//       (checkToClick.left == sendData.left &&
//         checkToClick.top == sendData.top) ||
//       (checkToClick.left == this.currentLeft &&
//         checkToClick.top == this.currentTop)
//     ) {
//       this.apFloorPlanService.action = "FLOORPLAN";
//       this.apFloorPlanService.apData = JSON.stringify(sendData);
//       this.router.navigate(["/ap-controller/device-list/view-device-info"]);
//       //this.router.navigate(['/ap-controller/device-list/view-device-info',{action:"FLOORPLAN", apData : JSON.stringify(sendData) }]);
//     }
//   }

//   fnToggleFullscreen(event: any) {
//     event.target
//       .closest(".modal-dialog")
//       .parentElement.classList.toggle("full-mode");
//   }
//   close() {
//     this.manageModalService.dismissAll();
//     let t = sessionStorage.getItem("from")

//     // sessionStorage.clear();
//     if (t == "map") {
//       this.router.navigate(['/ap-controller/APDashboard']);
//       sessionStorage.setItem("from", '')
//     }


//   }
// }
