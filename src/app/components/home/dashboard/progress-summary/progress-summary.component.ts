import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DEFAULT_USER, User } from '../../../../models/user.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './progress-summary.component.html',
  styleUrl: './progress-summary.component.scss'
})
export class ProgressSummaryComponent {
  @Input() user: User = DEFAULT_USER;

  getLeagueGlowColor(): string {
    switch (this.user.league_name.toLowerCase()) {
      case 'kyber':
        return 'rgba(0, 255, 255, 0.5)'; // Cyan
      case 'aurodium':
        return 'rgba(255, 215, 0, 0.5)'; // Gold
      case 'chromium':
        return 'rgba(192, 192, 192, 0.5)'; // Silver
      case 'bronzium':
        return 'rgba(205, 127, 50, 0.5)'; // Bronze
      case 'carbonite':
        return 'rgba(169, 169, 169, 0.5)'; // Dark Gray
      default:
        return 'rgba(255, 255, 255, 0.5)'; // White (fallback)
    }
  }
}