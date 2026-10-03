import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { LoginRequest } from '../Models/login-request';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  email: string = 'ram@test.com';
  password: string = 'Test@123';
  constructor(private authService: AuthService) {
    
  }

  login() {
    const loginData: LoginRequest = {
      email: this.email,
      password: this.password
    };
    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
