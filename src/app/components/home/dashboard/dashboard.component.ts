import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../services/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProgressSummaryComponent } from './progress-summary/progress-summary.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProgressSummaryComponent,
    RouterLink,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  @Input() currentUser: User | null = null;
  @Output() logout = new EventEmitter<void>();

  @Input() progressData: any;

  handleLogout() {
    this.logout.emit();
  }
}
