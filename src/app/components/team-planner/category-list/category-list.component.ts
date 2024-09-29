import { Component, Input } from '@angular/core';
import { Category } from '../../../models/team.model';
import { CategoryComponent } from './category/category.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TeamService } from "../../../services/team/team.service";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoryComponent,
    MatButtonModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent { //possible name tab component to support multiple tabs of categories
  @Input() categories: Category[] = [];

  constructor(
    private teamService: TeamService
  ) {}

  addCategory() {
    this.teamService.createNewCategory();
  }

  addTeam(category: Category) {
    this.teamService.createNewTeam(category);
  }

}
