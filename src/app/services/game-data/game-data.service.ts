import { Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { SwgohApiService } from '../swgoh-api/swgoh-api.service';
import { Character } from '../../models/game-data/character.model';
import { Ship } from '../../models/game-data/ship.model';
import { Gear } from '../../models/game-data/gear.model';
import { Ability } from '../../models/game-data/ability.model';
import { DatacronSet } from '../../models/game-data/datacron-sets.model';
import { Stat } from '../../models/game-data/stat.model';
import { StorageService } from '../storage/storage.service';
import { GameDataStore } from '../../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class GameDataService extends StoreService {

  constructor(
    storageService: StorageService,
    private swgohApiService: SwgohApiService
  ) {
    super(storageService);
    this.cacheDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  }

  async getStore(): Promise<GameDataStore> {
    return {
      characters: await this.getCharacters(),
      ships: await this.getShips(),
      gear: await this.getGear(),
      abilities: await this.getAbilities(),
      datacronSets: await this.getDatacronSets(),
      statDefinitions: await this.getStatDefinitions()
    };
  }

  async getCharacters(): Promise<Character[]> {
    return this.fetchAndCacheData('characters', () => this.swgohApiService.getCharacters());
  }

  async getShips(): Promise<Ship[]> {
    return this.fetchAndCacheData('ships', () => this.swgohApiService.getShips());
  }

  async getGear(): Promise<Gear[]> {
    return this.fetchAndCacheData('gear', () => this.swgohApiService.getGear());
  }

  async getAbilities(): Promise<Ability[]> {
    return this.fetchAndCacheData('abilities', () => this.swgohApiService.getAbilities());
  }

  async getDatacronSets(): Promise<DatacronSet[]> {
    return this.fetchAndCacheData('datacron-sets', () => this.swgohApiService.getDatacronSets());
  }

  async getStatDefinitions(): Promise<Stat[]> {
    return this.fetchAndCacheData('stat-definitions', () => this.swgohApiService.getStatDefinitions());
  }
}
