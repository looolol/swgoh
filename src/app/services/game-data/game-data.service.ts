import { Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { SwgohApiService } from '../swgoh-api/swgoh-api.service';
import { Character } from '../../models/character.model';
import { Ship } from '../../models/ship.model';
import { Gear } from '../../models/gear.model';
import { Ability } from '../../models/ability.model';
import { DatacronSet } from '../../models/datacron-sets.model';
import { Stat } from '../../models/stat.model';
import { StorageService } from '../storage/storage.service';

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
