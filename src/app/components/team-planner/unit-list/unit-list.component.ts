import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CharacterComponent } from '../../shared/character/character.component';
import { CommonModule } from '@angular/common';
import { Category, Team, Unit } from '../../../models/team.model';
import { TeamUpdateEvent, TeamUpdateType } from '../../../models/team-update-event.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent
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

  moveUnit(unit: Unit, newIndex: number): void {
    this.teamUpdate.emit({
      type: TeamUpdateType.Move,
      category: this.category,
      team: this.team,
      unit: unit,
      newIndex: newIndex
    })
  }

  onDrop(event: CdkDragDrop<Unit[]>) {
    moveItemInArray(this.units, event.previousIndex, event.currentIndex);
  }

  removeUnit(unit: Unit) {
    this.teamUpdate.emit({
      type: TeamUpdateType.Remove,
      category: this.category,
      team: this.team,
      unit: unit
    })
  }

}
