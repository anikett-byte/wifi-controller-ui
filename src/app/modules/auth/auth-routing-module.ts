import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Signin } from '../../pages/auth/signin/signin';
import { Signup } from '../../pages/auth/signup/signup';
import { Fogotpassword } from '../../pages/auth/fogotpassword/fogotpassword';
import { OtpVerification } from '../../pages/auth/otp-verification/otp-verification';
import { ResetPassword } from '../../pages/auth/reset-password/reset-password';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch:'full',
  },
  {
    path: 'signin',
    component: Signin,
  },
  {
    path: 'signup',
    component: Signup,
  },
  {
    path: 'fogotpassword',
    component: Fogotpassword,
  },
  {
    path: 'otp-verification',
    component: OtpVerification,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
