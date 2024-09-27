import { Injectable } from '@angular/core';
import { Category, Team, Unit } from '../../models/team.model';
import { generateUniqueId } from '../../helper/common';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor() { }

  private numCategories: number = 0;

  //-------------------------------------------------------------------------------------------------
  // Category methods
  //-------------------------------------------------------------------------------------------------

  createNewCategory(): Category {
    this.numCategories++;

    return {
      id: generateUniqueId(),
      name: `Category ${this.numCategories}`,
      teams: []
    };
  }

  removeCategory(category: Category, categories: Category[]): void {
    const index = categories.indexOf(category);
    categories.splice(index, 1);
    this.numCategories--;
  }

  //-------------------------------------------------------------------------------------------------
  // Team methods
  //-------------------------------------------------------------------------------------------------

  addTeam(team: Team, category: Category): void {
    category.teams.push(team);
  }

  createNewTeam(): Team {
    return {
      id: generateUniqueId(),
      name: `New Team`,
      units: []
    };
  }

  removeTeam(team: Team, category: Category): void {
    const index = category.teams.indexOf(team);
    category.teams.splice(index, 1);
  }

  renameTeam(newName: string, team: Team): void {
    team.name = newName;
  }

  moveUnitInTeam(unit: Unit, team: Team, newIndex: number): void {
    const index = team.units.indexOf(unit);
    if (index !== -1) {
      team.units.splice(index, 1);
      team.units.splice(newIndex, 0, unit);
    }
  }

  //-------------------------------------------------------------------------------------------------
  // Unit methods
  //-------------------------------------------------------------------------------------------------

  addUnitToTeam(unit: Unit, team: Team): void {
    if (team.units.length < 5 && !team.units.some(u => u.id === unit.id)) {
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