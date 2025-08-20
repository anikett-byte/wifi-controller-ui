import { Component, inject, TemplateRef, ViewEncapsulation, viewChild, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule, provideFormlyConfig } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { Common } from '../../../services/common';
import { Externalap} from '../../../services/externalap';
// import { title } from 'process';
import { Master } from '../../../services/master';

@Component({
  selector: 'app-device-list',
  imports: [FormsModule,
            ReactiveFormsModule,
            FormlyModule,
            FormlyBootstrapModule,
            //DeviceList,
            TableComponent],
  templateUrl: './device-list.html',
  styleUrl: './device-list.scss'
})
export class DeviceList {
      formFields: FormlyFieldConfig[] = [];
      formModel: any = {};
      formOptions: FormlyFormOptions = {};
      form: FormGroup = new FormGroup<any>({});
      private modalService = inject(NgbModal);
      private external = inject(Externalap);
      private master = inject(Master);

      rowSelected: any[] = [];
      dataSource: any[] = [];
      dataSize: Number = this.dataSource.length;
      recordFrom: Number = 0;
      recordLimit: Number = 10;
      enableCheckbox: Boolean = true;
      enableConnectedUserCheckbox: Boolean = false;

      connectedDataSource: any[] = [];
      connectedDataSize = this.connectedDataSource.length;   
      apid: any = null;           

      // ------- Device List ----------
      displayedColumns: any = [{ field: 'ap_name', title: 'AP NAME' }, { field: 'product_name', title: 'MODEL' }, 
                            { field: 'product_sw_ver', title: 'VERSION' }, { field: 'status', title: 'STATUS' }, 
                            {field: 'gw_address', title: 'DEVICE IP'}, {field: 'gw_id', title: 'DEVICE MAC'}                            
                          ];

      tableButtons: any = [
        //{ lable: '<i class="fa fa-pencil" ></i>', function: 'editDetails', function_parameter_field: 'name', btnColor: 'btn-outline-primary' },        
        { lable: '<i class="fa fa-user" aria-hidden="true"> </i>', function: 'openConnectedUsers', function_parameter_field: 'row', btnColor: 'btn-outline-primary' },
        { lable: '<i class="fa fa-trash" aria-hidden="true"> </i>', function: 'deleteUsers', function_parameter_field: 'row', btnColor: 'btn-outline-primary' },
        { lable: '<i class="fa fa-map-marker" aria-hidden="true"> </i>', function: 'openAPLocation', function_parameter_field: 'row', btnColor: 'btn-outline-primary' }
      ];

      // ---------- Connected Users ------
      connctedUsersColumns: any = [{ field: 'mac', title: 'MAC' }, { field: 'signal', title: 'SIGNAL' }, 
                            { field: 'username', title: 'USERNAME' }, { field: 'vapid', title: 'VAPID' }, 
                            {field: 'macdetails', title: 'DEVICE DETAILS'}, 
                            //{field: 'gw_id', title: 'OPERATIONS'}                            
                          ];

      connectedTableButtons: any = [
          //{ lable: '<i class="fa fa-pencil" ></i>', function: 'editDetails', function_parameter_field: 'name', btnColor: 'btn-outline-primary' }       
      ];                          
                          
      @ViewChild('content') content!: TemplateRef<any>;
      @ViewChild('contentUpdateLoc') contentUpdateLoc!: TemplateRef<any>;
      @ViewChild('modalConfirmDelete') modalConfirmDelete!: TemplateRef<any>;

      ngOnInit() {         
            this.form = new FormGroup({});
            this.formOptions = {};     
            this.fetchDeviceList();        
      } 

      loadFormFields(){
            this.formFields = [                
                {
                        fieldGroupClassName: 'row',
                        fieldGroup: [
                            {
                            key: 'location',
                            type: 'input',
                            className: 'col-md-6',
                            templateOptions: {
                                label: 'Location',
                                placeholder: 'Enter Location',
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
                            key: 'address',
                            type: 'input',
                            className: 'col-md-6',
                            templateOptions: {
                                label: 'Address',
                                placeholder: 'Enter Address',
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
                            key: 'latitude',
                            type: 'input',
                            className: 'col-md-6',
                            templateOptions: {
                                label: 'Latitude',
                                placeholder: 'Enter Latitude',
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
                            key: 'longitude',
                            type: 'input',
                            className: 'col-md-6',
                            templateOptions: {
                                label: 'Longitude',
                                placeholder: 'Enter Longitude',
                                required: true,
                                maxLength: 100,
                            },
                            },
                        ]
                }
            ];
      }

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
      
      fetchDeviceList(){
          this.external.fetchDeviceList().subscribe((res: any) => {
              //console.log("PRINT DATA : ",res);
              
            if (Array.isArray(res) && Array.isArray(res[0])) {
                const records = res[0];
                if (records[0]?.status === 0) {
                    console.warn(records[0].alertmessage); // Not found case
                } else {
                    this.dataSource = records;         
                }
            }
          })
      }

      editDetails(data: any = []){
          //console.log("DATA On EDIT :",data);
          this.modalService.open(this.content, { });
      }

      reset(){      
          if(this.rowSelected.length == 0){
              this.master.toasterWarningMsg("Please select device to reboot..")
              return;
          }
          else{
                let deviceId = []; 
            
              for(var i=0; i< this.rowSelected.length; i++){
                  deviceId.push(this.rowSelected[i].apid);
              }
              const payload = {
                  gw_id: deviceId                  
              };
              this.external.resetDevice(payload).subscribe({
                  next:(res: any) => { 
                  //console.log("RESPONSE : ",res);
                  if(res.length > 0){
                      if(res[0].status == "1"){                          
                          this.master.toasterSuccessMsg(res[0].alertmessage);
                          this.rowSelected = [];
                      }
                      else{
                          this.master.toasterFailureMsg(res[0].alertmessage);
                      }
                  }
                  else{
                        this.master.toasterFailureMsg("No data found..");
                  }
                }
              });
          }
      }

      reboot(){   
          if(this.rowSelected.length == 0){              
              this.master.toasterWarningMsg("Please select device to reboot..")
              return;
          }
          else{
              let deviceId = [];              
              
              for(var i=0; i< this.rowSelected.length; i++){
                  deviceId.push(this.rowSelected[i].apid);
              }                           
              const payload = {
                  gw_id: deviceId                  
              };
              
              this.external.rebootDevice(payload).subscribe({
                next:(res: any) => {                       
                  //console.log("RESPONSE : ",res);
                  if(res.length > 0){
                      if(res[0].status == "1"){                          
                          this.master.toasterSuccessMsg(res[0].alertmessage);
                          this.rowSelected = [];
                      }
                      else{
                          this.master.toasterFailureMsg(res[0].alertmessage);
                      }
                  }
                  else{
                          this.master.toasterFailureMsg("No data found..");
                  }
                }
              });
          }          
      }

      refresh(){   
          this.ngOnInit();
      }
     
      openConnectedUsers(){          
          this.connectedUsers();
          this.modalService.open(this.content, { size: 'xl' });
      }

      connectedUsers(){            
            this.external.connectedUsersList().subscribe((res: any) => {
                let parsedRes = JSON.parse(res);                 
                const liveUsers = parsedRes.liveuser_list;               
                const userCount = parsedRes.liveuser_count;
                               
                if(res){
                    this.connectedDataSource = liveUsers;
                }                
            });
      }

      deleteUsers(row: any){            
            const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;

            const payload = {
                  apid: parsedRow.apid                  
            };

            this.modalService.open(this.modalConfirmDelete, { size: 'xl' });

             this.external.deleteAPUser(payload).subscribe({
                next:(res: any) => {                     
                  //console.log("RESPONSE : ",res);
                  if(res){                    
                      if (res[0].status === 1) {                               
                          this.external.toasterSuccessMsg(res[0].alertmessage);
                           this.rowSelected = [];
                          this.modalService.dismissAll();                      
                      }
                      else{
                          this.external.toasterFailureMsg(res[0].alertmessage);
                          this.modalService.dismissAll();
                      }
                  }
                }
              });
      }

      openAPLocation(row: any){
            const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;           
            this.apid = parsedRow.apid;
            this.loadFormFields();
            this.form.reset(); 
            this.formOptions = {}; 
            
            this.formModel = {
                'apid': parsedRow.apid,
                'location': parsedRow.location,
                'address': parsedRow.address,
                'latitude': parsedRow.latitude,
                'longitude': parsedRow.longitude                
            };

            setTimeout(() => {
                this.form.reset(this.formModel); 
                this.modalService.open(this.contentUpdateLoc, { size: 'xl' });
            });
      }

      updateAPLocation(){                                             
            const payload = {
                apid: this.apid,
                location: this.form.value.location,
                address: this.form.value.address,
                latitude: this.form.value.latitude,
                longitude: this.form.value.longitude
            };

            //console.log("PRINT PAYLOAD : ",payload);
            this.external.updateAPLocation(payload).subscribe({
                next:(res: any) => {                                    
                if(res.length > 0){                    
                    if(res[0].status == "1"){
                        this.master.toasterSuccessMsg(res[0].alertmessage);
                        this.modalService.dismissAll();
                    }
                    else{
                        this.master.toasterFailureMsg(res[0].alertmessage);
                        this.modalService.dismissAll();
                    }
                }
                else{
                    this.master.toasterFailureMsg("No data found..");
                }
                }
            });
      }


}
