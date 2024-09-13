import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';

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
  currentUser: User | null = null;

  progressData: any;
 
  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.checkLoginStatus();
    await this.isLoggedIn ? this.getProgressData() : null;
  }

  async checkLoginStatus(): Promise<void> {
    this.isLoggedIn = await this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = await this.authService.getCurrentUser();
    }
  }

  async handleLogin(allyCode: string): Promise<void> {
    try {
      await this.authService.login(allyCode);
      await this.checkLoginStatus();
    } catch (error) {
      console.error('Failed to login', error);
    }
  }

  async handleLogout(): Promise<void> {
    await this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  async getProgressData(): Promise<void> {
    this.progressData = await this.getMockProgressData();
    console.log(this.progressData);
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
