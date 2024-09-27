import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UnitService } from '../../../services/unit/unit.service';
import { TeamPlannerState, Unit } from '../../../models/team.model';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterComponent } from '../../shared/character/character.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
export class UnitSelectionComponent implements OnInit, OnChanges {

  @Input() state!: TeamPlannerState;
  @Input() isUnique: boolean = true;
  @Output() unitSelected = new EventEmitter<Unit>();
  @Output() drop = new EventEmitter<CdkDragDrop<Unit[]>>();

  searchTerm = '';
  filteredUnits: Unit[] = [];

  constructor(
    private unitService: UnitService
  ) {}

  ngOnInit() {
    this.updatedFilteredUnits();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['state'] || changes['filteredUnits']) {
      this.updatedFilteredUnits();
    }
  }

  private updatedFilteredUnits() {
    this.filteredUnits = this.sortUnitsByPower(this.state.units.filter(unit => !unit.assigned));
  }  
  
  private sortUnitsByPower(units: Unit[]): Unit[] {
    return units.sort((a, b) => b.userUnitData.data.power - a.userUnitData.data.power);
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.updatedFilteredUnits();
    } else {
      this.filteredUnits = this.sortUnitsByPower(
        this.unitService.filterUnits(this.searchTerm, this.state.units.filter(unit => !unit.assigned))
      );
    }
  }

  // when dragged from team -> unit-selection
  // emit event to team-planner which handles unit state
  onDrop(event: CdkDragDrop<Unit[]>) {
    if (event.previousContainer !== event.container) {
      const unit = event.item.data as Unit;
      console.log("Unit Selection Drop\n", unit.userUnitData.data.name, event);

      // Update the unit's assigneed status
      unit.assigned = false;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      this.updatedFilteredUnits();

      this.drop.emit(event);
    }
  }

  trackByUnitId(index: number, unit: Unit): string {
    return unit.id;
  }
}
