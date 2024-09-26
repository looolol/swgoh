import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import { GameDataStore, InitGameDataStore, InitUserDataStore, UserDataStore } from '../../models/store.model';
import { GameDataService } from '../../services/game-data/game-data.service';
import { Unit } from '../../models/user-data/unit.model';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../shared/character/character.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Category, Team } from '../../models/team.model';
import { UnitService } from '../../services/unit/unit.service';
import { TeamService } from '../../services/team/team.service';

@Component({
  selector: 'app-team-planner',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
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
export class TeamPlannerComponent implements OnInit, AfterViewInit {
  @ViewChild('characterScroll') characterScroll!: ElementRef;
  @ViewChild('container') container!: ElementRef;

  userDataStore: UserDataStore = InitUserDataStore;
  gameDataStore: GameDataStore = InitGameDataStore;

  categories: Category[] = [
    {
      name: 'Category 1',
      teams: [
        {
          name: 'Team 1',
          units: []
        }
      ]
    }
  ];

  unassignedTeam: Unit[] = [];
  displayedUnits: Unit[] = [];
  filteredUnits: Unit[] = [];

  batchSize = 50;
  isLoading = false;
  searchTerm = '';

  isResizing: boolean = false;
  resizeStartX: number = 0;
  resizeStartWidth: number = 0;
  containerWidth: number = 0;
  categoriesWidth: number = 50; // 50% of the screen width

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private gameDataService: GameDataService,
    private teamService: TeamService,
    private unitService: UnitService
  ) {}


  ngOnInit(): void {
    this.loadUserData();
  }

  ngAfterViewInit(): void {
    this.characterScroll.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    this.containerWidth = this.container.nativeElement.offsetWidth;
  }

  onScroll(): void {
    const element = this.characterScroll.nativeElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
      this.loadNextBatch();
    }
  }

  trackByBaseId(index: number, unit: Unit): string {
    return unit.data.base_id;
  }

  onResizeStart(event: MouseEvent): void {
    this.isResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartWidth = this.categoriesWidth;
    document.addEventListener('mousemove', this.onResize);
    document.addEventListener('mouseup', this.onResizeEnd);
  }

  onResize = (event: MouseEvent): void =>{
    if (!this.isResizing) return;
    const diffX = event.clientX - this.resizeStartX;
    const scaleFactor = 1;
    const newWidth = this.resizeStartWidth + (diffX / this.containerWidth * 100 * scaleFactor);
    this.categoriesWidth = Math.max(40, Math.min(75, newWidth));
  }

  onResizeEnd = (): void => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onResize);
    document.removeEventListener('mouseup', this.onResizeEnd);
  }

  private async loadUserData(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    this.userDataStore = await this.userDataService.getStore(user.ally_code);
    this.gameDataStore = await this.gameDataService.getStore();

    this.unassignedTeam = this.userDataStore.units.filter(unit => 
      this.gameDataStore.characters.some(char => char.base_id === unit.data.base_id)
    );

    this.unassignedTeam.sort((a, b) => b.data.power - a.data.power);
    this.filteredUnits = this.unassignedTeam;

    this.categories[0].teams[0].units = this.unassignedTeam.slice(0, 5);

    this.loadNextBatch();
  }

  loadNextBatch(): void {
    if (this.isLoading || this.displayedUnits.length >= this.filteredUnits.length) {
      return;
    }

    this.isLoading = true;
    const start = this.displayedUnits.length;
    const end = Math.min(start + this.batchSize, this.filteredUnits.length);
    this.displayedUnits = [...this.displayedUnits, ...this.filteredUnits.slice(start, end)];
    this.isLoading = false;
  }

  onSearch(): void {
    this.filteredUnits = this.unitService.filterUnits(this.searchTerm, this.unassignedTeam, this.gameDataStore);
    this.displayedUnits = [];
    this.loadNextBatch();
  }

  addNewCategory(): void {
    this.teamService.addNewCategory(this.categories);
  }

  addNewTeam(category: Category): void {
    this.teamService.addNewTeam(category);
  }

  removeTeam(team: Team, category: Category): void {
    this.teamService.removeTeam(team, category);
  }

  editTeamName(newName: string, team: Team): void {
    this.teamService.editTeamName(newName, team);
  }
}