import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnitService } from '../../../services/unit/unit.service';
import { Unit } from '../../../models/team.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
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
export class UnitSelectionComponent implements OnInit {

  @Input() units: Unit[] = [];
  @Input() isUnique: boolean = true;
  @Output() unitSelected = new EventEmitter<Unit>();
  @Output() drop = new EventEmitter<CdkDragDrop<Unit[]>>();

  searchTerm = '';
  filteredUnits: Unit[] = [];

  constructor(
    private unitService: UnitService
  ) {}

  ngOnInit() {
    this.intializeFilteredUnits();
  }

  private sortUnitsByPower(units: Unit[]): Unit[] {
    return units.sort((a, b) => b.userUnitData.data.power - a.userUnitData.data.power);
  }

  private intializeFilteredUnits() {
    this.filteredUnits = this.sortUnitsByPower([...this.units]);
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.intializeFilteredUnits();
    } else {
      this.filteredUnits = this.sortUnitsByPower(
        this.unitService.filterUnits(this.searchTerm, this.units)
      );
    }
  }

  onDrop(event: CdkDragDrop<Unit[]>) {
    this.drop.emit(event);
  }
}
