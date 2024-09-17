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
  currentUser: User = DEFAULT_USER;

  progressData: any;
 
  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.checkLoginStatus();
    if (this.isLoggedIn) {
      await this.getProgressData();
    }
  }

  async checkLoginStatus(): Promise<void> {
    this.isLoggedIn = await this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = await this.authService.getCurrentUser();
    } else {
      this.currentUser = DEFAULT_USER;
    }
  }

  async handleLogin(allyCode: string): Promise<void> {
    try {
      await this.authService.login(allyCode);
      await this.checkLoginStatus();
      if (this.isLoggedIn) {
        await this.getProgressData();
      }
    } catch (error) {
      console.error('Failed to login', error);
    }
  }

  async handleLogout(): Promise<void> {
    try {
      await this.authService.logout();
      this.isLoggedIn = false;
      this.currentUser = DEFAULT_USER;
      this.progressData = null;
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }

  async getProgressData(): Promise<void> {
    this.progressData = await this.getMockProgressData();
  }

  async getMockProgressData(): Promise<any> {
    // Mock implementation of getProgressData
    // In a real scenario, this would fetch data from a service
    const data = {
      galacticPower: 2500000,
      charactersUnlocked: 150,
      ships: 45,
      currentGoal: {
        name: 'Unlock Jedi Knight Luke',
        progress: 75
      },
      totalTasks: 20,
      completedTasks: 15
    };

    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve(data), 1000));
  }
}
