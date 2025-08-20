import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MenuMaster } from '../pages/masters/menu-master/menu-master';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Master {


  constructor(private http: HttpClient, private toaster: ToastrService) { }


  saveCompanyDetails(data: any) {
    return this.http.post(environment.secureBaseUrl + '/saveCompanyDetails', data);
  };
  getCompaniesList() {
    return this.http.get(environment.secureBaseUrl + '/getCompaniesList');
  };
  getSelectedCompanyDetails(companyId: number) {
    return this.http.get(environment.secureBaseUrl + '/getSelectedCompanyDetails/' + companyId);
  };
  getCompaniesListForDropDown() {
    return this.http.get(environment.secureBaseUrl + '/getCompaniesListForDropDown');
  };
  getDepartmentListForDropDown() {
    return this.http.get(environment.secureBaseUrl + '/getDepartmentListForDropDown');
  };
  getRolesListForDropDown() {
    return this.http.get(environment.secureBaseUrl + '/getRolesListForDropDown');
  };
  getUserTypeListForDropDown() {
    return this.http.get(environment.secureBaseUrl + '/getUserTypeListForDropDown');
  };
  getCountriesListForDropdown() {
    return this.http.get(environment.secureBaseUrl + '/getCountriesListForDropdown');
  };
  getStatesListForDropdown(coutryId: number) {
    return this.http.get(environment.secureBaseUrl + '/getStatesListForDropdown/' + coutryId);
  };
  getCitiesListForDropdown(stateId: number) {
    return this.http.get(environment.secureBaseUrl + '/getCitiesListForDropdown/' + stateId);
  };

  // --------------------------------CITY DETAILS
  getCitiesList() {
    return this.http.get(environment.secureBaseUrl + '/getCitiesList');
  };

  saveCityDetails(data: any) {
    // console.log(data)
    return this.http.post(environment.secureBaseUrl + '/saveCityDetails', data);
  };

  getSelectedCityDetails(CityId: any) {
    return this.http.get(environment.secureBaseUrl + '/getSelectedCityDetails');
  };

  updateCityDetails() {
    return this.http.get(environment.secureBaseUrl + '/updateCityDetails');
  }

  //-----------------State Details
  getStatesList() {
    return this.http.get(environment.secureBaseUrl + '/getStatesList');
  };

  saveStateDetails(data: any) {
    return this.http.post(environment.secureBaseUrl + '/saveStateDetails', data);
  };
  //--------Country Details
  getCountriesList() {
    return this.http.get(environment.secureBaseUrl + '/getCountriesList');
  };
  saveCountryDetails(value: any) {
    return this.http.get(environment.secureBaseUrl + '/saveCountryDetails');
  };
  //----------Menu Master

  fetchMenu(menuid: any) {
    return this.http.post(environment.secureBaseUrl + '/fetchMenu', menuid);
  };
  getMenuesListForDropDown() {
    return this.http.get(environment.secureBaseUrl + '/getMenuesListForDropDown');
  };

  saveMenu(data: any) {
    return this.http.post(environment.secureBaseUrl + '/saveMenu', data);
  };
  deleteMenu(MenuId: any ) {
    return this.http.post(environment.secureBaseUrl + '/deleteMenu', MenuId);
  }

  getSelectedMenuDetails(){

  }



  //--------Orchestratot Master
  fetchOrchestrator(id: number) {
    const payload = { id };
    return this.http.post(environment.secureBaseUrl + '/fetchOrchestrator', payload);
  }
  addOrchestrator(data: any) {
    return this.http.post(environment.secureBaseUrl + '/addOrchestrator', data);
  }
  updateOrchestrator(data: any) {
    return this.http.post(environment.secureBaseUrl + '/updateOrchestrator', data);
  }
  deleteOrchestrator(payload: { id: number, createdby: any, clientip: string }) {
    return this.http.post(environment.secureBaseUrl + '/deleteOrchestrator', payload);
  }
  // getSelectedOrchestratordetails(Id: any) {
  //   return this.http.get(environment.secureBaseUrl + '/getSelectedOrchestratordetails/' + Id);
  // };
   getSelectedOrchDetails(id: number) {
    return this.http.get(environment.secureBaseUrl + '/getSelectedOrchDetails/' + id);
  };



  //  ---------------------------- START Role Master ----------------------------------------
  saveRole(data: any) {
    return this.http.post(environment.secureBaseUrl + '/saveRole', data)
  }
  updateRole(data: any) {
    return this.http.post(environment.secureBaseUrl + '/updateRole', data)
  }
  fetchRole(data: any) {
    return this.http.post(environment.secureBaseUrl + '/fetchRole', data)
  }
  deleteRole(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteRole', payload)
  }
  // -----------------------------  END Role master -------------------------------




  //  ---------------------------- START USER Master ----------------------------------------



  // getDepartmentListForDropDown() {
  //   return this.http.get(environment.secureBaseUrl + '/getDepartmentListForDropDown');
  // };
  // getRolesListForDropDown() {
  //   return this.http.get(environment.secureBaseUrl + '/getRolesListForDropDown');
  // };
  // getUserTypeListForDropDown() {
  //   return this.http.get(environment.secureBaseUrl + '/getUserTypeListForDropDown');
  // };



  addUser(data: any) {
    return this.http.post(`${environment.secureBaseUrl}/addUser`, data);
  }

  getUserDetails(data: any) {
    return this.http.post(environment.secureBaseUrl + '/getUserDetails', data)
  }

  getUserList() {
    return this.http.get(environment.secureBaseUrl + '/getUserList');
  }

  fetchUser(payload: { id: number; createdby: string }) {
    return this.http.post(environment.secureBaseUrl + '/fetchUser', payload);
  }

  deleteUser(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteUser', payload)
  }
  // -----------------------------  END USER master -------------------------------



  //  ---------------------------- START Firmware Master ----------------------------------------

  saveFirmware(data: any) {
    return this.http.post(`${environment.secureBaseUrl}/saveFirmware`, data);
  }

  updateFirmware(data: any) {
    return this.http.post(environment.secureBaseUrl + '/updateFirmware', data)
  }

  fetchFirmware(payload: { id: number; createdby: string }) {
    return this.http.post(environment.secureBaseUrl + '/fetchFirmware', payload);
  }

  deleteFirmware(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteFirmware', payload)
  }

  APProductDropdownList(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/APProductDropdownList', payload)
  }

  newAPFirmwareList() {
    return this.http.get(environment.secureBaseUrl + '/newAPFirmwareList')
  }


  // -----------------------------  END Firmware master -------------------------------


  //--------Package Master

  addPackage(data: any) {
    return this.http.post(environment.secureBaseUrl + '/addPackage', data);
  }

  fetchPackage(pkid: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/fetchPackage', { pkid });
  }
  deletePackage(pkid: any) {
    return this.http.post(environment.secureBaseUrl + '/deletePackage', pkid);
  }
  fetchPackageTypeForDropdown(id: any) {
    return this.http.get(environment.secureBaseUrl + '/fetchPackageTypeForDropdown', id);
  }

  getSelectedPackageDetails(payload: any) {
    console.log("payload", payload);
    return this.http.get(`${environment.secureBaseUrl}/getSelectedPackageDetails/${payload}`);

  }
  // ------------------------------ START Subscriber master ------------------------

  fetchSubscriber(payload: { sid?: number; companyid: number }) {
    return this.http.post(environment.secureBaseUrl + '/fetchSubscriber', payload);
  }
  addSubscriber(data: any) {
    return this.http.post(environment.secureBaseUrl + '/addSubscriber', data)
  }
  updateSubscriber(data: any) {
    return this.http.post(environment.secureBaseUrl + '/updateSubscriber', data)
  }
  deleteSubscriber(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteSubscriber', payload)
  }

  // -----------------------------  END Subscriber master -------------------------------


  // ------------------------------ START Orchestrator Mapping ------------------------

  fetchOrchestratorMapping(payload: { orc_id: number }) {
    return this.http.post(environment.secureBaseUrl + '/fetchOrchestratorMapping', payload);
  }

  saveOrchestratorMapping(data: any) {
    return this.http.post(environment.secureBaseUrl + '/saveOrchestratorMapping', data)
  }
  updateOrchestratorMapping(data: any) {
    return this.http.post(environment.secureBaseUrl + '/updateOrchestratorMapping', data)
  }
  deleteOrchestratorMapping(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteOrchestratorMapping', payload)
  }

  // -----------------------------  END Orchestrator Mapping  -------------------------------


  // ------------------------------ START Product Client Mapping ------------------------

  fetchProductClientMapping() {
    return this.http.get(environment.secureBaseUrl + '/fetchProductClientMapping')
  }
  saveProductClientMapping(data: any) {
    return this.http.post(environment.secureBaseUrl + '/saveProductClientMapping', data)
  }
  updateProductClientMapping(data: any) {
    return this.http.post(environment.secureBaseUrl + '/updateProductClientMapping', data)
  }
  deleteProductClientMapping(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteProductClientMapping', payload)
  }

  // -----------------------------  END Product Client Mapping -------------------------------


  // ------------------------------ START Product Code Mapping ------------------------

  saveDeviceProductCode(data: any) {
    return this.http.post(environment.secureBaseUrl + '/saveDeviceProductCode', data)
  }
  productCodeAssignToClient(data: any) {
    return this.http.post(environment.secureBaseUrl + '/productCodeAssignToClient', data)
  }
  discardDeviceProductCode(id: any) {
    return this.http.post(environment.secureBaseUrl + '/discardDeviceProductCode', id)
  }

  // -----------------------------  END  Product Code Mapping -------------------------------

  //----------------------------------NAS Managaer----------------------------------------------//
  addNAS(data: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/addNAS', data)
  }
  fetchNAS(id: number) {
    const payload = { id };
    return this.http.post(environment.secureBaseUrl + '/fetchNAS', payload);
  }

  updateNAS(payload: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/updateNAS', payload);
  }
  deleteNAS(payload: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/deleteNAS', payload);
  }
  getSelectednasDetails(id: any) {
    return this.http.get(`${environment.secureBaseUrl}/getSelectednasDetails/${id}`);
  }


  fetchNASConnectionTypeForDropdown(id: any) {
    return this.http.post(environment.secureBaseUrl + '/fetchNASConnectionTypeForDropdown', id);
  }

  fetchNASTypeForDropdown(id: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/fetchNASTypeForDropdown', id);
  }

  fetchNASDynamicAttributeForDropdown(id: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/fetchNASDynamicAttributeForDropdown', id);
  }

  //----------------------------------END NAS Managaer----------------------------------------------//


  //---------------------------------- NAS Mapping----------------------------------------------//

  nasPackageMapping(payload: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/nasPackageMapping', payload);
  }
  fetchNASMapping(id: number) {
    const payload = { id };
    return this.http.post(environment.secureBaseUrl + '/fetchNASMapping', payload);
  }

  deletenasmapping(payload: any): Observable<any> {
    return this.http.post(environment.secureBaseUrl + '/deletenasmapping', payload);
  }



  //----------------------------------END NAS Mapping----------------------------------------------//




  // ------------------------------ START AP Floor Plan ------------------------

  fetchExternalFloorPlan(payload: { pdid?: any }) {
    return this.http.post(environment.secureBaseUrl + '/fetchExternalFloorPlan', payload)
  }
  saveExternalFloorPlan(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/saveExternalFloorPlan', payload)
  }
  updateExternalFloorPlan(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/updateExternalFloorPlan', payload)
  }
  deleteExternalFloorPlan(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteExternalFloorPlan', payload)
  }


  saveExternalFloorPlanPin(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/saveExternalFloorPlanPin', payload)
  }
  deleteExternalFloorPlanPin(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteExternalFloorPlanPin', payload)
  }


  // ------------------------------ END AP Floor Plan ------------------------


  // ------------------------------ START Captive Portal Mapping ------------------------


  savegCaptivePortalMapping(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/savegCaptivePortalMapping', payload)
  }
  updateCaptivePortalMapping(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/updateCaptivePortalMapping', payload)
  }
  fetchCaptivePortalMapping(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/fetchCaptivePortalMapping', payload)
  }
  deleteCaptivePortalMapping(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/deleteCaptivePortalMapping', payload)
  }
  fetchBindIpoeGateway(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/fetchBindIpoeGateway', payload)
  }
  fetchBindLoginPage(payload: any) {
    return this.http.post(environment.secureBaseUrl + '/fetchBindLoginPage', payload)
  }




  // ------------------------------ END Captive Portal Mapping ------------------------


  //---------Toastr
  toasterSuccessMsg(msg: string) {
    return this.toaster.success('success!', msg);
  }

  toasterFailureMsg(msg: string) {
    return this.toaster.error('error!', msg)
  }

  toasterWarningMsg(msg: string) {
    return this.toaster.warning('warning!', msg);
  }

}








