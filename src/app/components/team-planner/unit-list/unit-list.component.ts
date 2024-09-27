import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CharacterComponent } from '../../shared/character/character.component';
import { CommonModule } from '@angular/common';
import { Category, Team, Unit } from '../../../models/team.model';
import { TeamUpdateEvent, TeamUpdateType } from '../../../models/team-update-event.model';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
    DragDropModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.scss'
})
export class UnitListComponent {

  @Input() units: Unit[] = [];
  @Input() team!: Team;
  @Input() category!: Category;
  @Input() isUnique: boolean = true;
  @Output() teamUpdate = new EventEmitter<TeamUpdateEvent>();

  onDrop(event: CdkDragDrop<Unit[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Update the local units array
      this.units = [...this.units];

      this.teamUpdate.emit({
        type: TeamUpdateType.Move,
        category: this.category,
        team: this.team,
        unit: event.item.data as Unit,
        newIndex: event.currentIndex
      });
    } else {
      moveItemInArray(this.units, event.previousIndex, event.currentIndex);
      
      // Update the local units array
      this.units = [...this.units];
    }
  }

  removeUnit(unit: Unit) {
    this.teamUpdate.emit({
      type: TeamUpdateType.Remove,
      category: this.category,
      team: this.team,
      unit: unit
    });
  }
}
