import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { LoginRequest } from '../Models/login-request';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  constructor(private authService: AuthService, private router: Router) {

  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginDta: LoginRequest = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };

    this.authService.login(loginDta).subscribe({
      next: response => {
        console.log('Login successful:', response);
        localStorage.setItem('token',response.token)  
        this.router.navigate(['/dashboard']);
      },
     error: error => {
       console.error('Login failed:', error);
     }
    });

  }

  logout() {
    this.authService.logout();
  }
 
}
