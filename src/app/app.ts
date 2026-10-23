import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';
import { Navbar } from './shared/navbar/navbar';



@Component({
  imports: [RouterOutlet,Login,Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Rohit - My First Angular Project');

  /*protected readonly isDisabled = signal(false);

  protected username = '';

  protected login() {
    console.log("login button clicked");

    this.isDisabled.set(true);
  }*/
}
