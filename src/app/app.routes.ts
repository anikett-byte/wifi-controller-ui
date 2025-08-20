import { Routes } from '@angular/router';
import { Auth } from './layouts/auth/auth';
import { Admin } from './layouts/admin/admin';
import { Client } from './layouts/client/client';
import { Common } from './layouts/common/common';
import { Master } from './layouts/master/master';


export const routes: Routes = [
    {
    path: '',
    component: Auth,
    children:[
      {
          path:'',
          loadChildren: () => import('./modules/auth/auth-module').then(m => m.AuthModule)
      }
    ]
  },

    {
    path: 'admin',
    component: Admin,
    children:[
      {
          path:'',
          loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule)
      },
    ]
  },

    {
    path: 'client',
    component: Client,
    children:[
      {
          path:'',
          loadChildren: () => import('./modules/client/client-module').then(m => m.ClientModule)
      }
     
    ]
  },
  
    {
    path: 'common',
    component: Common,
    children:[
      {
          path:'',
          loadChildren: () => import('./modules/common-using/common-using-module').then(m => m.CommonUsingModule)
      }
     
    ]
  },

    {
    path: 'masters',
    component: Master,
    children:[
      {
          path:'',
          loadChildren: () => import('./modules/masters/masters-module').then(m => m.MastersModule)
      }
    ]
  },
];
