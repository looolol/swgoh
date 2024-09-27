import { Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { SwgohApiService } from '../swgoh-api/swgoh-api.service';
import { User } from '../../models/user-data/user.model';
import { StorageService } from '../storage/storage.service';
import { UserUnitData } from '../../models/user-data/unit-user-data.model';
import { Mod } from '../../models/user-data/mod.model';
import { Datacron } from '../../models/user-data/datacron.model';
import { UserDataStore } from '../../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService extends StoreService {
  constructor(
    storageService: StorageService,
    private swgohApiService: SwgohApiService
  ) {
    super(storageService);
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  async getStore(allyCode: number): Promise<UserDataStore> {
    return {
      user: await this.getUser(allyCode),
      units: await this.getUnits(allyCode),
      ships: await this.getShips(allyCode),
      mods: await this.getMods(allyCode),
      datacrons: await this.getDatacrons(allyCode)
    };
  }

  async getUser(allyCode: number): Promise<User> {
    return this.fetchAndCacheData(`${allyCode}_user`, () => this.swgohApiService.getPlayerProfile(allyCode));
  }

  async getUnits(allyCode: number): Promise<UserUnitData[]> {
    return await this.fetchAndCacheData(`${allyCode}_units`, () => this.swgohApiService.getUnits(allyCode));
  }

  async getShips(allyCode: number): Promise<UserUnitData[]> {
    return await this.fetchAndCacheData(`${allyCode}_units`, () => this.swgohApiService.getUnits(allyCode));
  }

  async getMods(allyCode: number): Promise<Mod[]> {
    return this.fetchAndCacheData(`${allyCode}_mods`, () => this.swgohApiService.getMods(allyCode));
  }

  async getDatacrons(allyCode: number): Promise<Datacron[]> {
    return this.fetchAndCacheData(`${allyCode}_datacrons`, () => this.swgohApiService.getDatacrons(allyCode));
  }
}
