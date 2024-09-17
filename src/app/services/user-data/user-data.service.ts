import { Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { SwgohApiService } from '../swgoh-api/swgoh-api.service';
import { User } from '../../models/user.model';
import { StorageService } from '../storage/storage.service';
import { Unit } from '../../models/unit.model';
import { Mod } from '../../models/mod.model';
import { Datacron } from '../../models/datacron.model';

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

  async getUser(allyCode: number): Promise<User> {
    return this.fetchAndCacheData(`${allyCode}_user`, () => this.swgohApiService.getPlayerProfile(allyCode));
  }

  async getUnits(allyCode: number): Promise<Unit[]> {
    return this.fetchAndCacheData(`${allyCode}_units`, () => this.swgohApiService.getUnits(allyCode));
  }

  async getMods(allyCode: number): Promise<Mod[]> {
    return this.fetchAndCacheData(`${allyCode}_mods`, () => this.swgohApiService.getMods(allyCode));
  }

  async getDatacrons(allyCode: number): Promise<Datacron[]> {
    return this.fetchAndCacheData(`${allyCode}_datacrons`, () => this.swgohApiService.getDatacrons(allyCode));
  }
}
