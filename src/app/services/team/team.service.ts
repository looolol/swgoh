import { Injectable } from '@angular/core';
import {Category, Team, TeamPlannerState, Unit} from '../../models/team.model';
import { generateUniqueId } from '../../helper/common';
import {UnitService} from "../unit/unit.service";
import {BehaviorSubject, Subject} from "rxjs";
import { moveItemInArray } from '@angular/cdk/drag-drop';

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

    this.createNewTeam(category);

    this.store.categories.push(category);
  }

  removeCategory(toRemove: Category): void {
    this.store.categories = this.store.categories.filter(category =>
      category !== toRemove
    );
    console.log("store.categories", this.store.categories);
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
    toRemove.units.forEach(unit => this.moveToUnitSelection(unit, toRemove));

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


  //-------------------------------------------------------------------------------------------------
  // Unit methods
  //-------------------------------------------------------------------------------------------------

  removeUnit(unit: Unit, team: Team) {
    this.moveToUnitSelection(unit, team);
  }


  //-------------------------------------------------------------------------------------------------
  // Change Detection
  //-------------------------------------------------------------------------------------------------

  notifyChangeDetection() {
    this.triggerChangeDetectionSubject.next();
  }

  // move unit from team to unit-selection
  moveToUnitSelection(unit: Unit, team: Team) {
    team.units = team.units.filter(teamUnit => teamUnit !== unit);
    unit.assigned = false;

    this.notifyChangeDetection();
  }

  moveToNewTeam(unit: Unit, newTeam: Team, oldTeam: Team | undefined = undefined) {
    if (newTeam.units.length >= 5) return;

    unit.assigned = true;
    
    newTeam.units.push(unit);
    if (oldTeam) {
      oldTeam.units = oldTeam.units.filter(oldUnit => oldUnit != unit);
    }

    this.notifyChangeDetection();
  }

  reorderInTeam(currentIndex: number, previousIndex: number, team: Team) {
    console.log("reorder in team");
    console.log("current index", currentIndex);
    console.log("previous index", previousIndex);
    console.log("team", team);

    moveItemInArray(team.units, previousIndex, currentIndex);


    this.notifyChangeDetection();
  }

  //-------------------------------------------------------------------------------------------------
  // Other
  //-------------------------------------------------------------------------------------------------


  get unique() {
    return this.store.isUnique;
  }

  toggleUnique() {
    this.store.isUnique = !this.store.isUnique;
  }

}
