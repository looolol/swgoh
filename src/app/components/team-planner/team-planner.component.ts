import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import { GameDataStore, InitGameDataStore, InitUserDataStore, UserDataStore } from '../../models/store.model';
import { GameDataService } from '../../services/game-data/game-data.service';
import { Unit } from '../../models/user-data/unit.model';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../shared/character/character.component';

@Component({
  selector: 'app-team-planner',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent
  ],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit {

  userDataStore: UserDataStore = InitUserDataStore;
  gameDataStore: GameDataStore = InitGameDataStore;

  units: Unit[] = [];


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

    this.dispalyUnit();

    console.log('userDataStore', this.userDataStore);
    console.log('gameDataStore', this.gameDataStore);
  }

  private dispalyUnit() {

    const charNames = ["CAPTAINENOCH", "JEDIMASTERKENOBI", "THIRDSISTER", "HOTHREBELSCOUT", "UGNAUGHT"];
    charNames.forEach(charName => {
      const unit = this.userDataStore.units.find(u => u.data.base_id === charName);
      if (unit) {
        this.units.push(unit);
      }
    });
  }
}