import { Component, Input } from '@angular/core';
import { Category, Team } from '../../../../models/team.model';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeamComponent } from "./team/team.component";
import { MatIconModule } from '@angular/material/icon';
import { TeamService } from '../../../../services/team/team.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    TeamComponent,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  @Input() category!: Category;

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog
  ) {}

  openEditDialog(team: Team) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { name: team.name, type: "Team"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        team.name = result;
      }
    })
  }

  removeTeam(team: Team) {
    this.teamService.removeTeam(team);

    if (this.category.teams.length < 1) this.teamService.createNewTeam(this.category);
  }
}
