import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UnitService } from '../../../services/unit/unit.service';
import { Unit } from '../../../models/team.model';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterComponent } from '../../shared/character/character.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {TeamService} from "../../../services/team/team.service";

@Component({
  selector: 'app-unit-selection',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
    FormsModule,
    DragDropModule,
    ScrollingModule
  ],
  templateUrl: './unit-selection.component.html',
  styleUrl: './unit-selection.component.scss'
})
export class UnitSelectionComponent implements OnInit {

  @Output() drop = new EventEmitter<CdkDragDrop<Unit[]>>();

  searchTerm = '';
  filteredUnits: Unit[] = [];

  constructor(
    private unitService: UnitService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.unitService.unitsReadySubject.subscribe(isReady => {
      if (isReady) {
        // add all unassigned users to the list of selectable units

        // initialize filtered units with all selectable units
        this.filteredUnits = this.unitService.unassignedUnits;
      }
    });

    // ensure immutability to rerender the cdk-viewport
    this.teamService.triggerChangeDetection$.subscribe(() => {
      console.log("triggering change detection");
      this.filteredUnits = [...this.unitService.unassignedUnits];
    });
  }

  onSearch() {
    this.filteredUnits = this.unitService.filterUnits(this.searchTerm);
  }


  // when dragged from team -> unit-selection
  // emit event to team-planner which handles unit state
  onDrop(event: CdkDragDrop<Unit[]>) {
    if (event.previousContainer !== event.container) {
      const unit = event.item.data as Unit;
      const team = this.teamService.getTeamById(event.previousContainer.id);
      if (team) {
        this.teamService.moveToUnitSelection(unit, team);
      } else {
        console.warn(`Couldn't find team ${event.previousContainer.id}`);
      }
    }
  }

  trackByUnitId(index: number, unit: Unit): string {
    return unit.id;
  }

  onDragEnded(event: any) {
    console.log("on Drag Ended");
    this.filteredUnits = [...this.filteredUnits];
  }
}
