import { Component, Input } from '@angular/core';
import { CharacterComponent } from '../../../../shared/character/character.component';
import { CommonModule } from '@angular/common';
import { Team, Unit } from '../../../../../models/team.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TeamService } from "../../../../../services/team/team.service";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
    DragDropModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {

  @Input() team!: Team;


  constructor(
    private teamService: TeamService
  ) {}

  // when dragged from unit-selection to unit-list
  // or when dragged from unit-list to unit-list
  onDrop(event: CdkDragDrop<Unit[]>) {
    const unit = event.item.data as Unit;

    if (event.previousContainer !== event.container) {
      if (event.container.id === 'unit-selection') {
        console.log("moved from team to unit-selection");
        // moved to unit selection
        this.teamService.moveToUnitSelection(unit, this.team);
      } else {
        // moved to new team
        console.log("moved from team to new team", event.container.id);
        this.teamService.moveToNewTeam(unit, this.team);
      }
    } else {
      // reordered in team
      console.log("moved to same team: reorder unit")
      this.teamService.reorderInTeam();
    }
  }

  removeUnit(unit: Unit) {
    console.log("Remove unit", unit);
  }
}
