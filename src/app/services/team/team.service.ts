import { Injectable } from '@angular/core';
import { Category, Team } from '../../models/team.model';
import { Unit } from '../../models/user-data/unit.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor() { }

  //-------------------------------------------------------------------------------------------------
  // Category methods
  //-------------------------------------------------------------------------------------------------

  addCategory(category: Category, categories: Category[]): void {
    categories.push(category);
  }

  addNewCategory(categories: Category[]): void {
    const newCategory: Category = {
      name: `Category ${categories.length + 1}`,
      teams: []
    };
    categories.push(newCategory);
  }

  removeCategory(category: Category, categories: Category[]): void {
    const index = categories.indexOf(category);
    categories.splice(index, 1);
  }

  //-------------------------------------------------------------------------------------------------
  // Team methods
  //-------------------------------------------------------------------------------------------------

  addTeam(team: Team, category: Category): void {
    category.teams.push(team);
  }

  addNewTeam(category: Category): void {
    const newTeam: Team = {
      name: `Team ${category.teams.length + 1}`,
      units: []
    };
    category.teams.push(newTeam);
  }

  removeTeam(team: Team, category: Category): void {
    const index = category.teams.indexOf(team);
    category.teams.splice(index, 1);
  }

  editTeamName(newName: string, team: Team): void {
    team.name = newName;
  }

  //-------------------------------------------------------------------------------------------------
  // Unit methods
  //-------------------------------------------------------------------------------------------------

  addUnitToTeam(unit: Unit, team: Team): void {
    if (team.units.length < 5 && !team.units.some(u => u.data.base_id === unit.data.base_id)) {
      team.units.push(unit);
    }
  }

  removeUnitFromTeam(unit: Unit, team: Team): void {
    const index = team.units.indexOf(unit);
    if (index !== -1) {
      team.units.splice(index, 1);
    }
  }  
}
