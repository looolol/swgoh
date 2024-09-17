import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProgressSummaryComponent } from './progress-summary/progress-summary.component';
import { RouterLink } from '@angular/router';
import { DEFAULT_USER, User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSummaryComponent,
    RouterLink,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  @Input() user: User = DEFAULT_USER;
  @Output() logout = new EventEmitter<void>();

  swgoh_api = environment.swgoh_gg_url;

  handleLogout() {
    this.logout.emit();
  }

  get formattedAllyCode(): string {
    return this.user.ally_code.toString().slice(0,3) + '-' + 
           this.user.ally_code.toString().slice(3,6) + '-' + 
           this.user.ally_code.toString().slice(6,9);
  }
}
