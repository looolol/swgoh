import { Injectable } from '@angular/core';
import { Unit } from '../../models/user-data/unit.model';
import { GameDataStore } from '../../models/store.model';
import { Character } from '../../models/game-data/character.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor() { }

  filterUnits(searchTerm: string, units: Unit[], gameDataStore: GameDataStore): Unit[] {

    if (searchTerm.trim() === '') {
      return units;
    }

    const searchTerms = searchTerm.toLowerCase().split(' ');
    return units.filter(unit => {
      const character = gameDataStore.characters.find(char => char.base_id === unit.data.base_id);
      if (!character) return false;

      return searchTerms.every(term => this.matchesTerm(term, unit, character, gameDataStore));
    });
  }

  private matchesTerm(term: string, unit: Unit, character: Character, gameDataStore: GameDataStore): boolean {
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
      return unit.data.gear_level >= 13; // G13 or higher (has relics)
    }
    if (term === 'nonrelic' || term === 'nonrelics' || term === "nr") {
      return unit.data.gear_level < 13; // Less than G13 (no relics)
    }

    const gearMatch = term.match(/([<>=]?)g(\d+)/);
    if (gearMatch) {
      const [, operator, gearLevel] = gearMatch;
      const unitGear = unit.data.gear_level;
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
      const unitRelic = unit.data.relic_tier - 2; // Adjust for game's relic tier representation
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
      const ship = gameDataStore.ships.find(ship => ship.base_id === character.ship);
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
