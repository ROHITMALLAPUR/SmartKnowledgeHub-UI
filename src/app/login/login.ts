import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth';
import { LoginRequest } from '../Models/login-request';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  registrationMessage = '';
  loginError = '';
  isLoggingIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const registered =
      this.route.snapshot.queryParamMap.get('registered');

    if (registered === 'true') {
      this.registrationMessage =
        'Registration successful. Please login.';
    }
  }

  login(): void {
    this.loginError = '';

    // Stop if form validation fails
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: LoginRequest = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };

    this.isLoggingIn = true;

    this.authService.login(loginData).subscribe({
      next: response => {
        this.isLoggingIn = false;

        localStorage.setItem('token', response.token);

        this.router.navigate(['/dashboard']);
      },

      error: error => {
        console.error('Login failed:', error);

        this.isLoggingIn = false;
        this.loginError =
          'Invalid email or password. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
