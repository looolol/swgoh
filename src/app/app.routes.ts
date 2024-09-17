import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TeamPlannerComponent } from './components/team-planner/team-planner.component';
import { FarmingPlansComponent } from './components/farming-plans/farming-plans.component';
import { CharacterFarmingComponent } from './components/character-farming/character-farming.component';
import { ConquestPlannerComponent } from './components/conquest-planner/conquest-planner.component';
import { ShipsComponent } from './components/ships/ships.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team-planner', component: TeamPlannerComponent, canActivate: [AuthGuard] },
  { path: 'farming-plans', component: FarmingPlansComponent, canActivate: [AuthGuard] },
  { path: 'character-farming', component: CharacterFarmingComponent, canActivate: [AuthGuard] },
  { path: 'ships', component: ShipsComponent, canActivate: [AuthGuard] },
  { path: 'conquest-planner', component: ConquestPlannerComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];