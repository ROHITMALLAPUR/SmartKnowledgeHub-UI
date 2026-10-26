import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';
import { RegisterRequest } from '../Models/register-requst';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  email = '';
  password = '';

  isRegistering = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onRegister(): void {
    if (
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password
    ) {
      this.errorMessage.set('Please complete all fields.');
      return;
    }

    const registerData: RegisterRequest = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.isRegistering.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isRegistering.set(false);
        this.successMessage.set('Registration successful! Redirecting to login...');

        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' }
        });
      },
      error: (error) => {
        console.error('Registration failed:', error);
        console.log('STATUS:', error.status);
        console.log('STATUS TEXT:', error.statusText);
        console.log('ERROR BODY:', error.error);
        console.log('FULL ERROR:', error);

        this.isRegistering.set(false);

        if (error.status === 400) {
          this.errorMessage.set(
            'Registration failed. Check your details; the username or email may already be in use.'
          );
        } else {
          this.errorMessage.set(
            'Unable to register right now. Please try again.'
          );
        }
      }
    });
  }
}
