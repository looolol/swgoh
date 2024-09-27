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


  // when dragged from unit-selection to unit-list
  // or when dragged from unit-list to unit-list
  onDrop(event: CdkDragDrop<Unit[]>) {
    if (event.previousContainer !== event.container) {
      const unit = event.item.data as Unit;
      console.log("Unit List Drop Different Container\n", unit.userUnitData.data.name, event);

      unit.assigned = true;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Update the local units array
      //this.units = [...this.units];

      this.teamUpdate.emit({
        type: TeamUpdateType.Move,
        category: this.category,
        team: this.team,
        unit: unit,
        newIndex: event.currentIndex
      });
    } else {
      console.log("Unit List Drop Same Container\n", (event.item.data as Unit).userUnitData.data.name, event);
      moveItemInArray(this.units, event.previousIndex, event.currentIndex);
      
      // Update the local units array
      //this.units = [...this.units];
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
