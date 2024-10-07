import { Injectable } from '@angular/core';
import {StorageService} from "../storage/storage.service";
import {StoreService} from "../store/store.service";
import {ConquestFeat, ConquestSector, ConquestStore} from "../../models/conquest.model";
import {allConquestSectors} from "../../models/conquest-feats";

@Injectable({
  providedIn: 'root'
})
export class ConquestService extends StoreService {

  cacheKey = "conquest-feats";

  constructor(
    storageService: StorageService
  ) {
    super(storageService);
    this.cacheDuration = 3 * 31 * 24 * 60 * 60 * 1000; // 3 months in milliseconds (max length of conquest cycle)
  }

  async getStore(): Promise<ConquestStore> {
    return this.fetchAndCacheData(this.cacheKey, () => this.initConquestFeats())
  }

  async initConquestFeats(): Promise<ConquestStore> {
    return allConquestSectors;
  }

  getSectors(store: ConquestStore): ConquestSector[] {
    return [
      store.global,
      store.sectorOne,
      store.sectorTwo,
      store.sectorThree,
      store.sectorFour,
      store.sectorFive
    ]
  }

  getStoreFeatProgress(store: ConquestStore): number {
    const sectors = this.getSectors(store);
    return sectors.reduce((sum, sector) => sum + this.getSectorFeatProgress(sector), 0);
  }

  getSectorFeatProgress(sector: ConquestSector) {
    return this.getFeatsProgress([...sector.feats, ...sector.miniBossNode, ...sector.bossNode]);
  }

  getFeatsProgress(feats: ConquestFeat[]): number {
    return feats
      .filter(feat => feat.completed)
      .reduce((sum, feat) => sum + feat.keycards, 0);
  }

  getSectorFeatTotal(sector: ConquestSector): number {
    return [...sector.feats, ...sector.bossNode, ...sector.miniBossNode]
      .reduce((sum, feat) => sum + feat.keycards, 0);
  }



  async saveStore(conquestStore: ConquestStore): Promise<void> {
    return await this.setCache(this.cacheKey, conquestStore);
  }
}
