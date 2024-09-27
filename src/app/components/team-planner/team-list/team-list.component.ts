import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Team, Unit } from '../../../models/team.model';
import { CommonModule } from '@angular/common';
import { UnitListComponent } from '../unit-list/unit-list.component';
import { TeamUpdateEvent } from '../../../models/team-update-event.model';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule,
    UnitListComponent,
    DragDropModule
  ],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent {
  @Input() teams: Team[] = [];
  @Input() category!: Category;
  @Input() isUnique: boolean = true;
  @Output() teamUpdate = new EventEmitter<TeamUpdateEvent>();

  onTeamUpdate(event: TeamUpdateEvent): void {
    this.teamUpdate.emit(event);
  }
}
