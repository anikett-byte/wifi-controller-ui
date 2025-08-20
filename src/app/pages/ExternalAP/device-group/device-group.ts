import { Component, inject, TemplateRef, ViewEncapsulation, viewChild, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule, provideFormlyConfig } from '@ngx-formly/core';
import { TableComponent } from '../../../shared-components/table/table.component';
import { Common } from '../../../services/common';
import { Externalap} from '../../../services/externalap';
// import { title } from 'process';
import { Master } from '../../../services/master';
import { CommonModule } from '@angular/common';

interface User {
  wlangroupname: string;
  type: string; 
  formSections: {    
    status: string;
    ssid: string;
    vlanid: string;
    wirelesssecurity: string;
    hidessid: string,
    pskkey: string
  }[]; 
}

@Component({
  selector: 'app-device-group',
  imports: [FormsModule,
            ReactiveFormsModule,
            //RouterOutlet,
            CommonModule,            
            FormlyBootstrapModule,            
            TableComponent,
           
            ],
  templateUrl: './device-group.html',
  styleUrl: './device-group.scss'
})
export class DeviceGroup {
    private external = inject(Externalap);
    private master = inject(Master);
    private modalService = inject(NgbModal);
    // ----------------------------------------------------------

    

    /*dropdownSettings = {
      singleSelection: false,
      idField: 'apid',
      textField: 'gw_id',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };*/

    formFields: FormlyFieldConfig[] = [];
    formModel: any = {};
    formOptions: FormlyFormOptions = {};
    form: FormGroup = new FormGroup<any>({});

    rowSelected: any[] = [];
    dataSource: any[] = [];
    dataSize: Number = this.dataSource.length;
    recordFrom: Number = 0;
    recordLimit: Number = 10;
    enableCheckbox: Boolean = false;

    viewAPdataSource: any[] = [];
    viewAPdataSize: Number = this.dataSource.length;
    singleVap:any = [];
    dualVap:any = [];

    displayedColumns: any = [{ field: 'group_name', title: 'WLAN GROUP Name' }, { field: 'updated_at', title: 'LAST UPDATED ON' } ];

    tableButtons: any = [
        { lable: '<i class="fa fa-eye" ></i>', function: 'viewList', function_parameter_field: 'name', btnColor: 'btn-outline-primary' },        
        { lable: '<i class="fa fa-pencil" aria-hidden="true"> </i>', function: 'editDetails', function_parameter_field: 'row', btnColor: 'btn-outline-primary' },
        { lable: '<i class="fa fa-trash" ></i>', function: 'deleteGroup', function_parameter_field: 'name', btnColor: 'btn-outline-primary' }
        
    ];

    displayedAPListColumns: any = [
              { field: 'gw_id', title: 'DEVICE MAC' }, { field: 'ap_name', title: 'AP NAME' },
              { field: 'channel', title: 'CHANNEL' }, { field: 'gw_address', title: 'DEVICE IP' },              
              { field: 'is_up', title: 'WLAN GROUP Name' }, { field: 'uptime', title: 'ONLINE TIME' },
              { field: 'status', title: 'STATUS' }
    ];

    // --------------------------------------------
    userForm: FormGroup;
    userList: User[] = [];
    editIndex: number | null = null;

    mainForm: FormGroup;
    
    status: any = [{key:0,value:'Enable'},{key:1,value:'Disable'} ];
    w_security = [{key:0, value:'None'},{key:1, value:'WPA-PSK/WPA2-PSK'},{key:2, value:'WPA2-PSK'}];
    h_ssid: any= [{key: 0,value:'Show'}, {key:1,value:'Hide'}]; 
    warningMessage = '';
    selectedType: string = 'Single';
    deviceList: any = [];
    isEditMode: Boolean = false;

    @ViewChild('content') content!: TemplateRef<any>;
    @ViewChild('contentVIEWAP') contentVIEWAP!: TemplateRef<any>;

  
    constructor(private fb: FormBuilder) {
        this.userForm = this.fb.group({
          wlangroupname: ['', Validators.required],
          type: ['Single', Validators.required],
          devicelist: ['',Validators.required]         
        });
        
         this.mainForm = this.fb.group({
          formSections: this.fb.array([]) 
        });
    }

    ngOnInit() {                                            
        this.form = new FormGroup({});
        this.formOptions = {};   

        const req ={apgroupid:0}
        this.fetchDeviceGroupData(req);     
        
        // ------------------------------------------------
        this.selectedType = 'Single';

        this.userForm.get('type')?.valueChanges.subscribe(value => {
          this.selectedType = value;
        });
       
        this.addForm();        
    }

    getSelectedRows(data: any) {        
      this.rowSelected = data;           
    }

    getTableData(filter: any) {
      this.recordFrom = parseInt(filter.startFrom);
      this.recordLimit = parseInt(filter.limitTo);
    }

    triggerRecordOperation(evnt: any) {
      console.log("EVENT : ",evnt);
      var functionStr = `this.${evnt.operation}('${evnt.field}')`;
      new Function(functionStr).call(this);
    }

    fetchDeviceGroupData(apgroupid: any){
        const req={apgroupid : apgroupid}
        this.external.fetchDeviceGroupData(req).subscribe((res: any) => {       
          console.log("GROUP DATA : ",res);   
          if (Array.isArray(res)) {
              const records = res;
              if (records[0]?.status === 0) {
                console.warn(records[0].alertmessage); // Not found case
              } else {
                this.dataSource = records;         
              }
          }
          console.log("DATA SOURCE : ",this.dataSource);         
        });
    }

    openAddDeviceGroup(){
        console.log("ADD Device GROUP");
        this.fetchAPGroupDropdownDeviceList();
        this.modalService.open(this.content, { size: 'xl' });
    }

    viewList(row: any){       
          console.log("PRNT ROW : ",row);             
          this.fetchAPList(row);
          this.modalService.open(this.contentVIEWAP, { size: 'xl' });
    }

    fetchAPList(row:any){
        console.log("ROW DATA : ",row);
        const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
        console.log("UPDATE AP LOC :",parsedRow.apgroupid);        
        
          this.external.viewAPList(parsedRow.apgroupid).subscribe((res: any) => {
              console.log("VIEW AP LIST : ",res);
              this.viewAPdataSource = res;
          });
    }

    deleteGroup(row: any){
          //console.log("DELETE GROUP : ",row);

          const parsedRow = typeof row === 'string' ? JSON.parse(row) : row;
          const payload = {
                  apgroupid: parsedRow.apgroupid                  
          };
          //console.log("DELETE payload : ",payload);

          this.external.deleteAPGroup(payload).subscribe((res: any) => {                       
                  //console.log("RESPONSE : ",res);
              if(res){
                  if(res.status == "1"){                          
                          this.master.toasterSuccessMsg(res.alertmessage);
                          this.rowSelected = [];
                          this.modalService.dismissAll();
                  }
                  else{
                          this.master.toasterFailureMsg(res.alertmessage);
                          this.modalService.dismissAll();
                  }
              }
          });
      }

    // ---------------------------------- 1st Form ---------------------------------

    fetchAPGroupDropdownDeviceList(){
        this.external.fetchAPGroupDropdownDeviceList().subscribe((res: any) => {          
          console.log("RESULT : ",res);
          if (Array.isArray(res) && Array.isArray(res)) {
              const records = res;
              if (records[0]?.status === 0) {
                console.warn(records[0].alertmessage); // Not found case
              } else {
                this.deviceList = records;         
              }
          }
          console.log("DATA SOURCE : ",this.deviceList);         
        });
    }

    saveData() {

        if(!this.isEditMode){
          if (this.userForm.invalid) return;

          const userData: User = this.userForm.value;
          const formArrayValues = this.mainForm.get('formSections')?.value || [];

          const fullFormData = {
            ...userData,
            formSections: formArrayValues
          };
                            
          this.external.saveAPDeviceGroup(fullFormData).subscribe({           
            next:(res: any) => { 
              console.log("RESULT : ",res);
              if (res[0].status === 1) {                  
                  this.master.toasterSuccessMsg(res[0].alertmessage);
                  this.fetchDeviceGroupData(0); 
                  this.modalService.dismissAll();
                  this.resetForm();
              }
              else{
                  this.master.toasterFailureMsg(res[0].alertmessage);
                  this.modalService.dismissAll();
              }
            }
          });  
        }
        else{
            if (this.userForm.invalid) return;

            const userData: User = this.userForm.value;
            const formArrayValues = this.mainForm.get('formSections')?.value || [];

            const fullFormData = {
              ...userData,
              formSections: formArrayValues
            };

            this.external.updateAPDeviceGroup(fullFormData).subscribe({ 
                next:(res: any) => { 
                  console.log("RESULT : ",res);
                  if (res[0].status === 1) {                  
                      this.master.toasterSuccessMsg(res[0].alertmessage);
                      this.fetchDeviceGroupData(0); 
                      this.modalService.dismissAll();
                      this.resetForm();
                  }
                  else{
                      this.master.toasterFailureMsg(res[0].alertmessage);
                      this.modalService.dismissAll();
                  }
                }
            });
        }                       
    }

    editDetails(row: any){
          this.isEditMode = true;
          this.fetchAPGroupDropdownDeviceList();
          const parsedRow = typeof row === 'string' ? JSON.parse(row) : row; 
          this.external.fetchDeviceGroupData(parsedRow.apgroupid).subscribe((res: any) => {
          console.log("RESULT :", res);
          if (res.length > 0) {
            const groupData = res[0];

            // Patch main userForm
            this.userForm.patchValue({
              wlangroupname: groupData.group_name,
              type: groupData.type == 1 ? 'Dual' : 'Single', // Assuming type is 1 for Dual and 0 for Single
              devicelist: groupData.apid
            });

            // Set selectedType for dynamic UI
            this.selectedType = groupData.type == 1 ? 'Dual' : 'Single';

            // Clear existing formSections
            const formArray = this.mainForm.get('formSections') as FormArray;
            formArray.clear();

            // Create and patch new form sections
            const section = this.createFormSection();
            section.patchValue({
              status: groupData.vap_disable,
              ssid: groupData.vap_ssid,
              vlanid: groupData.vap_vlan_id,
              wirelesssecurity: groupData.vap_auth,
              hidessid: groupData.vap_hide_ssid,
              pskkey: groupData.vap_psk_key
            });

            // If multiple VAP records are returned in an array (update as needed):
            /*
            data.vaps.forEach((vap: any) => {
              const section = this.createFormSection();
              section.patchValue({
                status: vap.vap_disable,
                ssid: vap.vap_ssid,
                vlanid: vap.vap_vlan_id,
                wirelesssecurity: vap.vap_auth,
                hidessid: vap.vap_hide_ssid,
                pskkey: vap.vap_psk_key,
              });
              formArray.push(section);
            });
            */

            formArray.push(section);
          }

          // Open modal
          this.modalService.open(this.content, { size: 'xl' });
        });

    }

    resetForm() {
    this.userForm.reset();
    this.editIndex = null;

    const formArray = this.mainForm.get('formSections') as FormArray;
      while (formArray.length) {
        formArray.removeAt(0);
      }

      this.selectedType = 'Single';
    }

  //----------------------------- 2nd form---------------

  get formSections(): FormArray {
    return this.mainForm.get('formSections') as FormArray;
  }

  createFormSection(): FormGroup {
    return this.fb.group({      
      status: ['', Validators.required],
      ssid: ['', Validators.required],
      vlanid: ['', Validators.required],
      wirelesssecurity: ['', Validators.required],
      hidessid: ['', Validators.required],
      pskkey: ['', Validators.required]
    });
  }

  addForm() {
    this.warningMessage = '';
    const lastIndex = this.formSections.length - 1;
   // console.log("LAST INDEX : ",lastIndex, '--', this.formSections.at(lastIndex).invalid);

    if (lastIndex >= 0 && this.formSections.at(lastIndex).invalid) {      
      this.master.toasterWarningMsg('Please fill in the previous form before adding a new one.');
      //alert(this.warningMessage);
      return;
    }

    this.formSections.push(this.createFormSection());
  }

  /*submit() {
    if (this.mainForm.valid) {
      console.log('Form Values:', this.mainForm.value);
      alert(JSON.stringify(this.mainForm.value, null, 2));
    } else {
      alert('Please fill all required fields.');
    }
  }*/

}
