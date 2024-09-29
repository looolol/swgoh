import { Component, Input } from '@angular/core';
import { Category } from '../../../../models/team.model';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TeamComponent } from "./team/team.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    TeamComponent,
    DragDropModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  @Input() category!: Category;
}
