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

export interface Team {
  name: string;
  units: Unit[];
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
    FormsModule
  ],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit, AfterViewInit {
  @ViewChild('characterScroll') characterScroll!: ElementRef;

  userDataStore: UserDataStore = InitUserDataStore;
  gameDataStore: GameDataStore = InitGameDataStore;

  unassignedTeam: Unit[] = [];
  displayedUnits: Unit[] = [];
  filteredUnits: Unit[] = [];

  batchSize = 50;
  isLoading = false;
  searchTerm = '';

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