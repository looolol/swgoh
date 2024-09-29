import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { UnitSelectionComponent } from './unit-selection/unit-selection.component';
import { MatButtonModule } from '@angular/material/button';
import { TeamService } from '../../services/team/team.service';
import { AuthService } from '../../services/auth/auth.service';
import { Category } from '../../models/team.model';
import { DragDropModule } from '@angular/cdk/drag-drop';

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

  allCategories: Category[] = [];

  constructor(
    private authService: AuthService,
    private teamService: TeamService,

  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    await this.teamService.loadStores(user.ally_code);

    // further support for this later
    // for now, one tab setup with default category and default team
    this.allCategories = this.teamService.allCategories;
    this.teamService.createNewCategory();
  }

  toggleUnique() {
    this.teamService.toggleUnique();
  }
}
