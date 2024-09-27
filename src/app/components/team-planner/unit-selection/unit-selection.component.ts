import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnitService } from '../../../services/unit/unit.service';
import { Unit } from '../../../models/team.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unit-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
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

  constructor(private unitService: UnitService) {}

  ngOnInit() {
    this.filteredUnits = this.units;
  }

  onSearch() {
    this.filteredUnits = this.unitService.filterUnits(this.searchTerm, this.units);
  }

  onDrop(event: CdkDragDrop<Unit[]>) {
    this.drop.emit(event);
  }

}
