import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import { GameDataStore, InitGameDataStore, InitUserDataStore, UserDataStore } from '../../models/store.model';
import { GameDataService } from '../../services/game-data/game-data.service';
import { Unit } from '../../models/user-data/unit.model';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../shared/character/character.component';
import { MatCardModule } from '@angular/material/card';
import { Character } from '../../models/game-data/character.model';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    ScrollingModule
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

  itemSize = 130; // Approximate height of each character item

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

    console.log('userDataStore', this.userDataStore);
    console.log('gameDataStore', this.gameDataStore);

    console.log('unassignedTeam', this.unassignedTeam.units);
    console.log('lockedUnits', lockedUnits);
  }
}