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
import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';

export interface Team {
  name: string;
  units: Unit[];
}

export interface Category {
  name: string;
  teams: Team[];
}

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
    MatIconModule,
    DragDropModule
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
    private gameDataService: GameDataService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngAfterViewInit(): void {
    this.characterScroll.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    this.containerWidth = this.container.nativeElement.offsetWidth;
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


  addCategory(): void {
    const newCategory: Category = {
      name: `Category ${this.categories.length + 1}`,
      teams: []
    }
    this.categories.push(newCategory);
  }

  addTeam(category: Category): void {
    const newTeam: Team = {
      name: `Team ${category.teams.length + 1}`,
      units: []
    };
    category.teams.push(newTeam);
  }

  removeTeam(category: Category, team: Team): void {
    const index = category.teams.indexOf(team);
    if (index !== -1) {
      category.teams.splice(index, 1);
    }
  }

  editTeamName(team: Team, newName: string): void {
    team.name = newName;
  }

  addUnitToTeam(team: Team, unit: Unit): void {
    if (team.units.length < 5 && !team.units.some(u => u.data.base_id === unit.data.base_id)) {
      team.units.push(unit);
      this.removeUnitFromUnassigned(unit);
    }
  }

  removeUnitFromTeam(team: Team, unit: Unit): void {
    const index = team.units.indexOf(unit);
    if (index !== -1) {
      team.units.splice(index, 1);
      this.unassignedTeam.push(unit);
      this.unassignedTeam.sort((a, b) => b.data.power - a.data.power);
    }
  }

  private removeUnitFromUnassigned(unit: Unit): void {
    const index = this.unassignedTeam.findIndex(u => u.data.base_id === unit.data.base_id);
    if (index !== -1) {
      this.unassignedTeam.splice(index, 1);
    }
  }

  reorderUnitInTeam(team: Team, unit1: Unit, unit2: Unit): void {
    const index1 = team.units.findIndex(u => u === unit1);
    const index2 = team.units.findIndex(u => u === unit2);

    if (index1 === -1 || index2 === -1 || index1 === index2) {
      return; // Invalid units or no change needed
    }

    // Swap the positions of the two units
    [team.units[index1], team.units[index2]] = [team.units[index2], team.units[index1]];
  }

  reorderTeamInCategory(category: Category, team: Team, direction: 'up' | 'down'): void {
    const index = category.teams.indexOf(team);
    if (index === -1) return; // Team not found in category

    let newIndex: number;
    if (direction === 'up') {
      newIndex = Math.max(0, index - 1);
    } else {
      newIndex = Math.min(category.teams.length - 1, index + 1);
    }

    if (newIndex !== index) {
      // Remove the team from its current position
      category.teams.splice(index, 1);
      // Insert the team at its new position
      category.teams.splice(newIndex, 0, team);
    }
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
    if (this.searchTerm.trim() === '') {
      this.filteredUnits = this.unassignedTeam;
    } else {
      const searchTerms = this.searchTerm.toLowerCase().split(' ');
      this.filteredUnits = this.unassignedTeam.filter(unit => {
        const character = this.gameDataStore.characters.find(char => char.base_id === unit.data.base_id);
        if (!character) return false;
        
        return searchTerms.every(term => {
          if (term === 'ship') {
            return character.ship;
          }
          if (term === 'noship') {
            return !character.ship;
          }

          if (character.name.toLowerCase().includes(term)) return true;

          // Check for tag match
          if (character.categories.some(tag => tag.toLowerCase().includes(term))) return true;

          // Check for alignment match
          if (character.alignment.toLowerCase().includes(term)) return true;

          // Check for role match
          if (character.role && character.role.toLowerCase().includes(term)) return true;

          // Check for ability class match
          if (character.ability_classes.some(cls => cls.toLowerCase().includes(term))) return true;

          // Check for gear tier match
          // Check for 'relics' or 'nonrelic' terms
          if (term === 'relic' || term === "relics" || term === "rl") {
            return unit.data.gear_level >= 13; // G13 or higher (has relics)
          }
          if (term === 'nonrelic' || term === 'nonrelics' || term === "nr") {
            return unit.data.gear_level < 13; // Less than G13 (no relics)
          }

          const gearMatch = term.match(/([<>=]?)g(\d+)/);
          if (gearMatch) {
            const [, operator, gearLevel] = gearMatch;
            const unitGear = unit.data.gear_level;
            switch (operator) {
              case '<':
                return unitGear < parseInt(gearLevel);
              case '>':
                return unitGear > parseInt(gearLevel);
              case '=':
              case '':
                return unitGear === parseInt(gearLevel);
            }
          }

          // Check for relic tier match
          const relicMatch = term.match(/([<>=]?)r(\d+)/);
          if (relicMatch) {
            const [, operator, relicLevel] = relicMatch;
            const unitRelic = unit.data.relic_tier - 2; // Adjust for game's relic tier representation
            switch (operator) {
              case '<':
                return unitRelic < parseInt(relicLevel);
              case '>':
                return unitRelic > parseInt(relicLevel);
              case '=':
              case '':
                return unitRelic === parseInt(relicLevel);
            }
          }

          if (character.ship) {
            // Check for ship class match (if it's a ship)
            const ship = this.gameDataStore.ships.find(ship => ship.base_id === character.ship);
            if (ship && ship.name.toLowerCase().includes(term)) {
              return true;
            }

            // Check for capital ship match
            if (term === 'capital' && ship && ship.capital_ship) {
              return true;
            }
          }

          return false;
        });
      });
    }

    this.displayedUnits = [];
    this.loadNextBatch();
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
}