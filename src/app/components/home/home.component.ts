import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User, DEFAULT_USER } from '../../models/user.model';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    DashboardComponent,
    MatToolbarModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  user: User = DEFAULT_USER;
 
  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.checkLoginStatus();
  }

  async checkLoginStatus(): Promise<void> {
    this.isLoggedIn = await this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.user = await this.authService.getCurrentUser();
    } else {
      this.user = DEFAULT_USER;
    }
  }

  async handleLogin(allyCode: string): Promise<void> {
    try {
      this.user = await this.authService.login(allyCode);
      this.isLoggedIn = true;
    } catch (error) {
      console.error('Failed to login', error);
    }
  }

  async handleLogout(): Promise<void> {
    try {
      await this.authService.logout();
      this.isLoggedIn = false;
      this.user = DEFAULT_USER;
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }
}
