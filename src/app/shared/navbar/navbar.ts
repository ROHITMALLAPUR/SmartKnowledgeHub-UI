import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from "../../auth";
import { Router } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  constructor(public authService: AuthService,private router:Router) {
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
