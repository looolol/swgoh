import { Injectable } from '@angular/core';
import {Category, Team, TeamPlannerState, Unit} from '../../models/team.model';
import { generateUniqueId } from '../../helper/common';
import {UnitService} from "../unit/unit.service";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  store: TeamPlannerState = {
    units: [],
    categories: [],
    isUnique: true
  };

  private triggerChangeDetectionSubject = new Subject<void>();

  triggerChangeDetection$ = this.triggerChangeDetectionSubject.asObservable();

  constructor(
    private unitService: UnitService
  ) { }

  async loadStores(allyCode: number) {
    await this.unitService.loadStores(allyCode);
  }


  //-------------------------------------------------------------------------------------------------
  // Category methods
  //-------------------------------------------------------------------------------------------------

  createNewCategory(): void {

    const category: Category = {
      id: generateUniqueId(),
      name: `Category ${this.store.categories.length + 1}`,
      teams: []
    };

    this.store.categories.push(category);
  }

  removeCategory(toRemove: Category): void {
    this.store.categories = this.store.categories.filter(category =>
      category !== toRemove
    );
  }

  get allCategories() {
    return this.store.categories;
  }

  get allTeams(): Team[] {
    return this.store.categories.flatMap(category => category.teams);
  }

  //-------------------------------------------------------------------------------------------------
  // Team methods
  //-------------------------------------------------------------------------------------------------

  createNewTeam(category: Category): void {
    const team: Team = {
      id: generateUniqueId(),
      name: `New Team`,
      units: []
    };

    category.teams.push(team);
  }

  removeTeam(toRemove: Team): void {
    this.store.categories.forEach(category => {
      category.teams = category.teams.filter(team =>
        team !== toRemove
      );
    })
  }

  renameTeam(newName: string, team: Team): void {
    team.name = newName;
  }

  getTeamById(id: string): Team | undefined {
    return this.allTeams.find(team => team.id === id);
  }


  //////
  // Event Emitter
  //////

  notifyChangeDetection() {
    this.triggerChangeDetectionSubject.next();
  }

  // move unit from team to unit-selection
  moveToUnitSelection(unit: Unit, team: Team) {
    console.log("TeamService moveToUnitSelection");
    console.log("unit", unit);
    console.log("team", team);

    team.units = team.units.filter(teamUnit => teamUnit !== unit);
    unit.assigned = false;

    this.notifyChangeDetection();
  }

  moveToNewTeam(unit: Unit, team: Team) {
    console.log("TeamService moveToNewTeam");
    console.log("unit", unit);
    console.log("team", team);

    unit.assigned = true;
    team.units.push(unit);

    this.notifyChangeDetection();
  }

  reorderInTeam() {
    console.log("TeamService reorderInTeam");

    this.notifyChangeDetection();
  }

  ///////
  // Other
  ///////


  get unique() {
    return this.store.isUnique;
  }

  toggleUnique() {
    this.store.isUnique = !this.store.isUnique;
  }

}
