import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import { GameDataStore, InitGameDataStore, InitUserDataStore, UserDataStore } from '../../models/store.model';
import { GameDataService } from '../../services/game-data/game-data.service';
import { Unit } from '../../models/user-data/unit.model';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../shared/character/character.component';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Character } from '../../models/game-data/character.model';

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
    ScrollingModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit {

  userDataStore: UserDataStore = InitUserDataStore;
  gameDataStore: GameDataStore = InitGameDataStore;

  teams: Team[] = [];
  unassignedTeam: Team = {
    name: 'Unassigned',
    units: []
  };

  displayedUnits: Unit[] = [];
  batchSize = 50;
  currentBatch = 0;

  itemSize = 130; // Approximate height of each character item

  isLoading = false;

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private gameDataService: GameDataService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    console.log('user', user);
    this.userDataStore = await this.userDataService.getStore(user.ally_code);
    this.gameDataStore = await this.gameDataService.getStore();

    const lockedUnits: Character[] = [];
    this.gameDataStore.characters.forEach(character => {
      const unit = this.userDataStore.units.find(unit => unit.data.name === character.name);
      if (unit) {
        this.unassignedTeam.units.push(unit);
      } else {
        lockedUnits.push(character);
      }
    });

    this.unassignedTeam.units.sort((a, b) => b.data.power - a.data.power);

    this.loadNextBatch();

    console.log('userDataStore', this.userDataStore);
    console.log('gameDataStore', this.gameDataStore);

    console.log('unassignedTeam', this.unassignedTeam.units);
    console.log('lockedUnits', lockedUnits);
  }

  loadNextBatch(): void {
    if (this.isLoading || this.displayedUnits.length >= this.unassignedTeam.units.length) {
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      const start = this.currentBatch * this.batchSize;
      const end = start + this.batchSize;
      this.displayedUnits = [...this.displayedUnits, ...this.unassignedTeam.units.slice(start, end)];
      this.currentBatch++;
      this.isLoading = false;
    }, 500); // Simulate a delay for demonstration purposes
  }
}