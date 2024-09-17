import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import { GameDataStore, InitGameDataStore, InitUserDataStore, UserDataStore } from '../../models/store.model';
import { GameDataService } from '../../services/game-data/game-data.service';

@Component({
  selector: 'app-team-planner',
  standalone: true,
  imports: [],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit {

  userDataStore: UserDataStore = InitUserDataStore;
  gameDataStore: GameDataStore = InitGameDataStore;


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

    console.log('userDataStore', this.userDataStore);
    console.log('gameDataStore', this.gameDataStore);
  }
}