import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MenuMaster } from '../pages/masters/menu-master/menu-master';
import {ToastrService} from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Externalap {

  constructor(private http: HttpClient,private toaster: ToastrService) { }

  // ------------------- AP Register ----------------------
  fetchAPRegisterDetails(){      
      return this.http.get(environment.secureBaseUrl + '/fetchExternalAPRegister');
  }

  saveAPRegister(data: any): Observable<any> {
      return this.http.post(environment.secureBaseUrl + '/saveExternalAPRegister',data);
  }

  updateAPRegister(data: any): Observable<any> {
      return this.http.post(environment.secureBaseUrl + '/updateExternalAPRegister',data);
  }

  // --------------------- Device List -------------------

  fetchDeviceList(){      
      return this.http.get(environment.secureBaseUrl + '/externalAPDeviceList');
  }

  resetDevice(data: any): Observable<any> {      
      return this.http.post(environment.secureBaseUrl + '/resetExternalAPList', data);
  }

  rebootDevice(data: any): Observable<any> {
      return this.http.post(environment.secureBaseUrl + '/rebootExternalAPList', data);
  }

  connectedUsersList(){
      return this.http.get(environment.secureBaseUrl + '/connectedUserList');
  }

  deleteAPUser(data: any): Observable<any> {      
      return this.http.post(environment.secureBaseUrl + '/deleteAPUser', data);
  }

  updateAPLocation(data: any): Observable<any> {
      return this.http.post(environment.secureBaseUrl + '/updateAPLocation', data);
  }

  fetchDeviceGroupData(apgroupid: any): Observable<any>{
      return this.http.post(environment.secureBaseUrl + '/fetchExternalDeviceGroup',{apgroupid});
  }

  fetchAPGroupDropdownDeviceList(){
      return this.http.get(environment.secureBaseUrl + '/fetchAPGroupDropdownDeviceList');
  }

  saveAPDeviceGroup(data: any): Observable<any> {
      return this.http.post(environment.secureBaseUrl + '/saveExternalDeviceGroup', data);
  }

  updateAPDeviceGroup(data: any): Observable<any>{
      return this.http.post(environment.secureBaseUrl + '/updateExternalDeviceGroup', data);
  }

  viewAPList(apgroupid: any){
      const params = new HttpParams()
        .set('apgroupid', apgroupid);
      console.log("VIEW AP LIST PARAM : ",params);
      return this.http.get(environment.secureBaseUrl + '/viewAPList' , {params});
  }

  fetchClientList(){      
      return this.http.get(environment.secureBaseUrl + '/getClientList');
  }

  deleteAPGroup(data: any): Observable<any> {
      return this.http.post(environment.secureBaseUrl + '/deleteExternalDeviceGroup',data);
  }

  


  //---------Toastr
  toasterSuccessMsg( msg: string ) {
    return this.toaster.success( 'success!', msg );
  }

  toasterFailureMsg( msg: string ) {
    return this.toaster.error( 'error!', msg )

  }
}
