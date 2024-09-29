import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { UnitSelectionComponent } from './unit-selection/unit-selection.component';
import { MatButtonModule } from '@angular/material/button';
import { TeamService } from '../../services/team/team.service';
import { AuthService } from '../../services/auth/auth.service';
import {Category, Team, Unit} from '../../models/team.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

export interface Tab
{
  categories: Category[];
}


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

  tabs: Tab[] = [];

  constructor(
    private authService: AuthService,
    private teamService: TeamService,

  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    await this.teamService.loadStores(user.ally_code);

    // further support for this later
    // for now, one tab setup with default category and default team
    const defaultTab = this.teamService.allCategories;
    this.teamService.createNewCategory();
    this.teamService.createNewTeam(defaultTab[0]);
    this.tabs.push({categories: defaultTab});
  }


  onTeamUpdate(event: any): void {
  }

  toggleUnique() {
    this.teamService.toggleUnique();
  }

  // emitted from unit-selection
  // so when dragged from team -> unit
  // what needs to happen?
  // 1. remove unit from team
  // 2. add unit to unassigned
  onDrop(event: CdkDragDrop<Unit[]>) {
    console.log("team planner onDrop");
  }
}
