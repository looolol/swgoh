import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { DEFAULT_USER, User } from '../../models/user.model';
import { UserDataService } from '../../services/user-data/user-data.service';
import { Unit } from '../../models/unit.model';
import { Mod } from '../../models/mod.model';
import { Datacron } from '../../models/datacron.model';

@Component({
  selector: 'app-team-planner',
  standalone: true,
  imports: [],
  templateUrl: './team-planner.component.html',
  styleUrl: './team-planner.component.scss'
})
export class TeamPlannerComponent implements OnInit {

  user: User = DEFAULT_USER;
  units: Unit[] = [];
  mods: Mod[] = [];
  datacrons: Datacron[] = [];
  

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    try {
      this.user = await this.authService.getCurrentUser(); 
      console.log("Got user", this.user);

      this.units = await this.userDataService.getUnits(this.user.ally_code);
      console.log("Got units", this.units);

      this.mods = await this.userDataService.getMods(this.user.ally_code);
      console.log("Got mods", this.mods);

      this.datacrons = await this.userDataService.getDatacrons(this.user.ally_code);
      console.log("Got datacrons", this.datacrons);

    } catch (error) {
      console.error('Error loading user data:', error);
      //handle error
    }
  }

  // private async loadPlayer(): Promise<void> {

  //   const data = await this.swgohApiService.getPlayerProfile(this.user.ally_code);

  //   // update userData with fetched data

  //   this.userDataService.saveUserData(this.user.ally_code, this.userData);
  // }
}