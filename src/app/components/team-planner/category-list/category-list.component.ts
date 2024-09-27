import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Team, Unit } from '../../../models/team.model';
import { TeamListComponent } from '../team-list/team-list.component';
import { CommonModule } from '@angular/common';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TeamUpdateEvent } from '../../../models/team-update-event.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    TeamListComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {

  @Input() categories: Category[] = [];
  @Input() isUnique: boolean = true;
  @Output() addCategory = new EventEmitter<void>();
  @Output() addTeam = new EventEmitter<string>();
  @Output() teamUpdate = new EventEmitter<TeamUpdateEvent>();
  @Output() drop = new EventEmitter<CdkDragDrop<Unit[]>>();

  onTeamUpdate(event: TeamUpdateEvent): void {
    this.teamUpdate.emit(event);
  }

  onDrop(event: CdkDragDrop<Unit[]>, team: Team) {
    this.drop.emit(event);
  }

}
