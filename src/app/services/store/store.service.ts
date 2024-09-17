import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { CachedData } from '../../models/cached-data.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  protected cacheDuration: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(protected storageService: StorageService) {}

  protected async getFromCache<T>(key: string): Promise<CachedData<T> | null> {
    const cachedData = await this.storageService.getItem(key);
    if (cachedData) {
      const parsed = JSON.parse(cachedData) as CachedData<T>;
      if (Date.now() - parsed.timestamp < this.cacheDuration) {
        return parsed;
      }
    }
    return null;
  }

  protected async setCache<T>(key: string, data: T): Promise<void> {
    const cacheItem = {
      timestamp: Date.now(),
      data: data
    };
    await this.storageService.setItem(key, JSON.stringify(cacheItem));
  }

  protected async fetchAndCacheData<T>(
    cacheKey: string, 
    fetchFunction: () => Promise<T>
  ): Promise<T> {
    const cachedData = await this.getFromCache<T>(cacheKey);
    if (cachedData) {
      return cachedData.data;
    }

    const data = await fetchFunction();
    await this.setCache(cacheKey, data);
    return data;
  }
}
