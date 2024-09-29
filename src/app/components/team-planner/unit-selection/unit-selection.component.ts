import { Component, OnInit } from '@angular/core';
import { UnitService } from '../../../services/unit/unit.service';
import { Unit } from '../../../models/team.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
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

  searchTerm = '';
  filteredUnits: Unit[] = [];

  itemsPerRow = 5;
  rowItems: Unit[][] = [];


  constructor(
    private unitService: UnitService,
    private teamService: TeamService
  ) {}


  ngOnInit() {
    this.unitService.unitsReadySubject.subscribe(isReady => {
      if (isReady) {
        this.filteredUnits = this.unitService.unassignedUnits;
        this.onSearch();
      }
    });

    // ensure immutability to rerender the cdk-viewport
    this.teamService.triggerChangeDetection$.subscribe(() => {
      this.filteredUnits = [...this.unitService.unassignedUnits];
      this.onSearch();
    });
  }

  onSearch() {
    this.filteredUnits = this.unitService.filterUnits(this.searchTerm);
    this.rowItems = this.chunkArray(this.filteredUnits, this.itemsPerRow);
  }

  chunkArray(array: Unit[], chunkSize: number): Unit[][] {
    const result: Unit[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }


  // when dragged from team -> unit-selection
  // emit event to team-planner which handles unit state
  onDrop(event: CdkDragDrop<Unit[][]>) {
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
}
