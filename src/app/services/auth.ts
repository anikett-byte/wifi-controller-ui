import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) { }

  login(authPayload: any): any {
    return this.http.post(environment.baseUrl+'/authentication', authPayload, { observe: 'response' });
  }

}
