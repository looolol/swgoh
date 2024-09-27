import { Injectable } from '@angular/core';
import { GameDataStore, InitGameDataStore, InitUserDataStore, UserDataStore } from '../../models/store.model';
import { Character } from '../../models/game-data/character.model';
import { Unit } from '../../models/team.model';
import { GameDataService } from '../game-data/game-data.service';
import { UserDataService } from '../user-data/user-data.service';
import { generateUniqueId } from '../../helper/common';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private userDataStore: UserDataStore = InitUserDataStore;
  private gameDataStore: GameDataStore = InitGameDataStore;

  constructor(
    private userDataService: UserDataService,
    private gameDataService: GameDataService) 
  {}

  async loadStores(allyCode: number): Promise<void> {
    this.userDataStore = await this.userDataService.getStore(allyCode);
    this.gameDataStore = await this.gameDataService.getStore();
  }

  getCharacterDefinition(unit: Unit): Character | undefined {
    const character = this.gameDataStore.characters.find(character => 
      character.base_id === unit.userUnitData.data.base_id
    );
    if (!character) {
      console.warn(`Character not found for unit with base_id: ${unit.userUnitData.data.base_id}`);
    }
    return character;
  }

  getAllUnits(): Unit[] {
    const allUnits: Unit[] = [];

    this.userDataStore.units.forEach(userUnit => {
      allUnits.push({
        id: generateUniqueId(),
        userUnitData: userUnit
      })
    })

    return allUnits;
  }


  filterUnits(searchTerm: string, units: Unit[]): Unit[] {

    if (searchTerm.trim() === '') {
      return units;
    }

    const searchTerms = searchTerm.toLowerCase().split(' ');
    return units.filter(unit => {
      const character = this.getCharacterDefinition(unit);
      if (!character) return false;

      return searchTerms.every(term => this.matchesTerm(term, unit, character));
    });
  }

  private matchesTerm(term: string, unit: Unit, character: Character): boolean {
    if (term === 'ship') {
      return !!character.ship;
    }
    if (term === 'noship') {
      return !character.ship;
    }

    if (character.name.toLowerCase().includes(term)) return true;

    // Check for tag match
    if (character.categories.some(tag => tag.toLowerCase().includes(term))) return true;

    // Check for alignment match
    if (character.alignment.toLowerCase().includes(term)) return true;

    // Check for role match
    if (character.role && character.role.toLowerCase().includes(term)) return true;

    // Check for ability class match
    if (character.ability_classes.some(cls => cls.toLowerCase().includes(term))) return true;

    // Check for gear tier match
    // Check for 'relics' or 'nonrelic' terms
    if (term === 'relic' || term === "relics" || term === "rl") {
      return unit.userUnitData.data.gear_level >= 13; // G13 or higher (has relics)
    }
    if (term === 'nonrelic' || term === 'nonrelics' || term === "nr") {
      return unit.userUnitData.data.gear_level < 13; // Less than G13 (no relics)
    }

    const gearMatch = term.match(/([<>=]?)g(\d+)/);
    if (gearMatch) {
      const [, operator, gearLevel] = gearMatch;
      const unitGear = unit.userUnitData.data.gear_level;
      switch (operator) {
        case '<':
          return unitGear < parseInt(gearLevel);
        case '>':
          return unitGear > parseInt(gearLevel);
        case '=':
        case '':
          return unitGear === parseInt(gearLevel);
      }
    }

    // Check for relic tier match
    const relicMatch = term.match(/([<>=]?)r(\d+)/);
    if (relicMatch) {
      const [, operator, relicLevel] = relicMatch;
      const unitRelic = unit.userUnitData.data.relic_tier - 2; // Adjust for game's relic tier representation
      switch (operator) {
        case '<':
          return unitRelic < parseInt(relicLevel);
        case '>':
          return unitRelic > parseInt(relicLevel);
        case '=':
        case '':
          return unitRelic === parseInt(relicLevel);
      }
    }

    if (character.ship) {
      // Check for ship class match (if it's a ship)
      const ship = this.gameDataStore.ships.find(ship => ship.base_id === character.ship);
      if (ship && ship.name.toLowerCase().includes(term)) {
        return true;
      }

      // Check for capital ship match
      if (term === 'capital' && ship && ship.capital_ship) {
        return true;
      }
    }

    return false;
  }
}
