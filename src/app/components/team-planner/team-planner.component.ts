import { Component, OnInit } from '@angular/core';
import { SwgohApiService } from '../../services/swgoh-api/swgoh-api.service';
import { StorageService } from '../../services/storage/storage.service';
import { AuthService } from '../../services/auth/auth.service';
import { DEFAULT_USER, DEFAULT_USER_DATA, User, UserData } from '../../models/user.model';
import { UserDataService } from '../../services/user-data/user-data.service';

@Component({
  selector: 'app-team-planner',
  standalone: true,
  imports: [],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit {

  user: User = DEFAULT_USER;
  userData: UserData = DEFAULT_USER_DATA;

  constructor(
    private swgohApiService: SwgohApiService,
    private authService: AuthService,
    private userDataService: UserDataService,
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    try {
      this.user = await this.authService.getCurrentUser();

      if (!(await this.userDataService.isExpired(this.user.allyCode))) {
        this.userData = await this.userDataService.getUserData(this.user.allyCode);
      } else {
        this.loadPlayer();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      //handle error
    }
  }

  private loadPlayer(): void {
    this.swgohApiService.getPlayerProfile(this.user.allyCode).subscribe({
      next: (data: any) => {
        this.userData.characters = data.units.filter((unit: any) => unit.data.combat_type === 1);
        this.userDataService.saveUserData(this.user.allyCode, this.userData);
        console.log('Player Profile loaded successfully', data);
      },
      error: (error) => {
        console.error('Error loading player profile:', error);
      }
    });
  }
}