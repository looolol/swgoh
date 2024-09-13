import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TeamPlannerComponent } from './components/team-planner/team-planner.component';
import { FarmingPlansComponent } from './components/farming-plans/farming-plans.component';
import { CharacterFarmingComponent } from './components/character-farming/character-farming.component';
import { ConquestPlannerComponent } from './components/conquest-planner/conquest-planner.component';
import { ShipsComponent } from './components/ships/ships.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team-planner', component: TeamPlannerComponent },
  { path: 'farming-plans', component: FarmingPlansComponent },
  { path: 'character-farming', component: CharacterFarmingComponent },
  { path: 'ships', component: ShipsComponent },
  { path: 'conquest-planner', component: ConquestPlannerComponent },
  { path: '**', redirectTo: '' },
];