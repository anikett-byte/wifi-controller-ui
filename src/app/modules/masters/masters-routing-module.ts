import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMaster } from '../../pages/masters/company-master/company-master';
import { CityMaster } from '../../pages/masters/city-master/city-master';
import { StateMaster } from '../../pages/masters/state-master/state-master';
import { CountryMaster } from '../../pages/masters/country-master/country-master';
import { MenuMaster } from '../../pages/masters/menu-master/menu-master';
import { OrchestratorMaster } from '../../pages/masters/orchestrator-master/orchestrator-master';
import { ApRegister } from '../../pages/ExternalAP/ap-register/ap-register';
import { DeviceList } from '../../pages/ExternalAP/device-list/device-list';
import { RoleMaster } from '../../pages/masters/role-master/role-master';
import { Firmwaredetails } from '../../pages/masters/firmwaredetails/firmwaredetails';
import { DeviceMaster } from '../../pages/masters/device-master/device-master';
import { PackageMaster } from '../../pages/masters/package-master/package-master';
import { OrchestratorMapping } from '../../pages/masters/orchestrator-mapping/orchestrator-mapping';
import { ProductClientMapping } from '../../pages/masters/product-client-mapping/product-client-mapping';
import { ProductCodeMapping } from '../../pages/masters/product-code-mapping/product-code-mapping';
import { SubscriberMaster } from '../../pages/masters/subscriber-master/subscriber-master';
import { DeviceGroup } from '../../pages/ExternalAP/device-group/device-group';
import { NasMaanager } from '../../pages/masters/nas-maanager/nas-maanager';
import { NasMapping } from '../../pages/masters/nas-mapping/nas-mapping';
import { UserMaster } from '../../pages/masters/user-master/user-master';
import { FloorPlan } from '../../pages/ExternalAP/floor-plan/floor-plan';
import { CaptivePortalMapping } from '../../pages/ExternalAP/captive-portal-mapping/captive-portal-mapping';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },
  {
    path: 'companies',
    component: CompanyMaster
  },
  {
    path: 'cities',
    component: CityMaster
  },
  {
    path: 'state',
    component: StateMaster
  },
  {
    path: 'country',
    component: CountryMaster
  },
  {
    path: 'menumaster',
    component: MenuMaster
  },
  {
    path: 'orchestratormaster',
    component: OrchestratorMaster
  },
  {
    path: 'roleMaster',
    component: RoleMaster
  },
  {
    path: 'userMaster',
    component: UserMaster
  },

  {
    path: 'firmwaredetails',
    component: Firmwaredetails
  },
  {
    path: 'apregister',
    component: ApRegister
  },
  {
    path: 'devicelist',
    component: DeviceList
  },
  {
    path: 'devicemaster',
    component: DeviceMaster
  },
  {
    path: 'packagemaster',
    component: PackageMaster
  },
  {
    path: 'apdevicegroup',
    //component: ApDeviceGroup
    component: DeviceGroup
  },
  {
    path: 'orchestratorMapping',
    component: OrchestratorMapping
  },
  {
    path: 'productClientMapping',
    component: ProductClientMapping
  },
  {
    path: 'productCodeMapping',
    component: ProductCodeMapping
  },
  {
    path: 'subscriberMaster',
    component: SubscriberMaster
  },
  {
    path: 'nasmanager',
    component: NasMaanager
  },
  {
    path: 'nasmapping',
    component: NasMapping

  },
  {
    path: 'floorPlan',
    component: FloorPlan
  },
  {
    path: 'captivePortalMapping',
    component: CaptivePortalMapping
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
