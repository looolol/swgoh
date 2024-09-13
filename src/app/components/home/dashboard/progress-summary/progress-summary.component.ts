import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './progress-summary.component.html',
  styleUrl: './progress-summary.component.scss'
})
export class ProgressSummaryComponent {
  @Input() progressData: any;
}