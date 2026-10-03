import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, } from './Models/login-request';
import {LoginResponse } from './Models/login-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7230/api/Auth'; // Replace with your backend API URL
  constructor(private http: HttpClient) { }

 login(loginData:LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      loginData
    );
  }

  
}
