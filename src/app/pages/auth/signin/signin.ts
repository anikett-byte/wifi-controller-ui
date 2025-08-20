import { Component, inject  } from '@angular/core';
import { MaterialModule } from '../../../shared-modules/material/material.module';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
import {CookieService} from 'ngx-cookie-service';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signin',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormlyBootstrapModule,
    FormlyModule
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin {


  signinForm: FormGroup;
  submitted = false;
  errorMessage = '';
  model: any = {};

  constructor(private fb: FormBuilder, private cookieService: CookieService, private authService: Auth, private router: Router) {
    this.signinForm = this.fb?.group({});
  }

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row', // Bootstrap row
      fieldGroup:[
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          type: 'email',
          label: 'Email',
          placeholder: 'Enter email',
          required: true,
        },
        validators: {
            customEmail: {
              expression: (control: any) => control.value?.endsWith('@cnergee.com'),
              message: 'Email must be from example.com domain',
            },
          },
          validation: {
            messages: {
              required: 'Email is required',
              email: 'Enter a valid email address',
            },
          },
          className: 'col-md-12', // 6-column layout
      },
      {
        key: 'password',
        type: 'input',
        templateOptions: {
          label: 'Password',
          type: 'password',
          required: true,
        },
        className: 'col-md-12', // 6-column layout
      },
    ]
    }
];


  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.signinForm.invalid) return;

    this.authService.login(this.signinForm.value).subscribe({
      next: (response: any) => {
        // Handle successful login
        console.log('Login successful!', response);
        this.cookieService.set('token', response.body.token);
        this.router.navigate(['/admin']);
        // Redirect or perform other actions as needed
      },
      error: (error: any) => {
        // Handle login error
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }

}
