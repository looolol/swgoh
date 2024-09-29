import { Component, Input } from '@angular/core';
import { Category } from '../../../models/team.model';
import { CategoryComponent } from './category/category.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TeamService } from "../../../services/team/team.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoryComponent,
    MatButtonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent { //possible name tab component to support multiple tabs of categories
  @Input() categories: Category[] = [];

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog
  ) {}

  addCategory() {
    this.teamService.createNewCategory();
  }

  addTeam(category: Category) {
    this.teamService.createNewTeam(category);
  }


  openEditDialog(category: Category) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { name: category.name, type: "Category"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        category.name = result;
      }
    })
  }

  removeCategory(category: Category) {
    console.log("remove category", category);

    this.teamService.removeCategory(category);

    //if (this.categories.length < 1) this.teamService.createNewCategory();
  }

}
