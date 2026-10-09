import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  constructor(private authService: AuthService, private router: Router) {

  }

  logout(): void {

    this.authService.logout();
    this.router.navigate(['/login']);

  }

}
