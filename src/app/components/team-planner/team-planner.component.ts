import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../shared/character/character.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TeamPlannerState, Unit } from '../../models/team.model';
import { UnitService } from '../../services/unit/unit.service';
import { TeamService } from '../../services/team/team.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TeamUpdateEvent, TeamUpdateType } from '../../models/team-update-event.model';
import { CategoryListComponent } from './category-list/category-list.component';
import { TeamListComponent } from './team-list/team-list.component';
import { UnitSelectionComponent } from './unit-selection/unit-selection.component';

@Component({
  selector: 'app-team-planner',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
    CategoryListComponent,
    TeamListComponent,
    UnitSelectionComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit {
 
  state: TeamPlannerState = {
    categories: [],
    allUnits: [],
    unassignedUnits: [],
    isUnique: true
  };

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private unitService: UnitService
  ) {}

  async ngOnInit(): Promise<void>{
    const user = await this.authService.getCurrentUser();
    await this.unitService.loadStores(user.ally_code);
    this.state.allUnits = this.unitService.getAllUnits();
    this.state.unassignedUnits = [...this.state.allUnits];
    this.addCategory();
    this.addTeam(this.state.categories[0].id);
  }

  addCategory(): void {
    const newCategory = this.teamService.createNewCategory();
    this.state.categories.push(newCategory);
  }

  addTeam(categoryId: string): void {
    const category = this.state.categories.find(c => c.id === categoryId);
    if (category) {
      const newTeam = this.teamService.createNewTeam();
      category.teams.push(newTeam);
    }
  }

  onTeamUpdate(event: TeamUpdateEvent): void {
    switch (event.type) {
      case TeamUpdateType.Add:
        this.teamService.addUnitToTeam(event.unit!, event.team);
        break;
      case TeamUpdateType.Remove:
        this.teamService.removeUnitFromTeam(event.unit!, event.team);
        break;
      case TeamUpdateType.Move:
        this.teamService.moveUnitInTeam(event.unit!, event.team, event.newIndex!);
        break;
      case TeamUpdateType.Rename:
        this.teamService.renameTeam(event.newName!, event.team);
        break;  
    }
    this.updateState();
  }

  private updateState(): void {
    // Update state based on the changes made
    // This might involve recalculating unassigned units
  }

  onUnitSelect(unit: Unit) {
    //Handle unit selection, possibly opening a dialog to choose which team to add it to
  }

  toggleUnique() {
    this.state.isUnique = !this.state.isUnique;
  }

  onDrop(event: CdkDragDrop<Unit[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    // Update state after transfer
  }
}
