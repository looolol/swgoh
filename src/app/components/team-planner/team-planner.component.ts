import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { UnitSelectionComponent } from './unit-selection/unit-selection.component';
import { MatButtonModule } from '@angular/material/button';
import { TeamService } from '../../services/team/team.service';
import { UnitService } from '../../services/unit/unit.service';
import { AuthService } from '../../services/auth/auth.service';
import { ImageLoadingService } from '../../services/image-loading/image-loading.service';
import { Unit, TeamPlannerState } from '../../models/team.model';
import { TeamUpdateEvent } from '../../models/team-update-event.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-team-planner',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    UnitSelectionComponent,
    MatButtonModule,
    DragDropModule
  ],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit {
  state: TeamPlannerState = {
    categories: [],
    units: [],
    isUnique: true
  };

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private unitService: UnitService,
    private imageLoadingService: ImageLoadingService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    await this.unitService.loadStores(user.ally_code);
    this.unitService.initializeUnits(this.state.units);
    this.preloadImages();
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
    // switch (event.type) {
    //   case TeamUpdateType.Add:
    //     this.teamService.addUnitToTeam(event.unit!, event.team);
    //     break;
    //   case TeamUpdateType.Remove:
    //     this.teamService.removeUnitFromTeam(event.unit!, event.team);
    //     break;
    //   case TeamUpdateType.Move:
    //     this.teamService.moveUnitInTeam(event.unit!, event.team, event.newIndex!);
    //     break;
    // }
    this.updateState();
  }

  toggleUnique() {
    this.state.isUnique = !this.state.isUnique;
  }

  onUnitSelect(unit: Unit) {
    // Handle unit selection, possibly opening a dialog to choose which team to add it to
  }

  private updateState(): void {
  } 

  private preloadImages() {
    const imageUrls = this.state.units
      .filter(unit => unit.userUnitData.data.combat_type === 1)
      .map(unit => unit.characterDefinition.image);

    this.imageLoadingService.preloadImages(imageUrls);
  }

  
  // emitted from unit-selection
  // so when dragged from team -> unit
  // what needs to happen?
  // 1. remove unit from team
  // 2. add unit to unassigned
  onDrop(event: CdkDragDrop<Unit[]>) {
    if (event.previousContainer !== event.container) {
      const unit = event.item.data as Unit;
      //console.log("Team Planner Drop", event, unit);
    }
    this.updateState();
  }
}
