import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { DEFAULT_USER, User } from '../../models/user.model';

@Component({
  selector: 'app-ships',
  standalone: true,
  imports: [],
  templateUrl: './ships.component.html',
  styleUrl: './ships.component.scss'
})
export class ShipsComponent implements OnInit {
  user: User = DEFAULT_USER;

  constructor(
    private authService: AuthService,
    // Add other necessary services
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    this.user = await this.authService.getCurrentUser();
    // Perform any other necessary data loading or API calls
  }

  // Add other component-specific methods
}