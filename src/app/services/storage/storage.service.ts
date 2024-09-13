import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async getItem(key: string): Promise<string | null> {
    if (this.isBrowser) {
      return Promise.resolve(localStorage.getItem(key));
    }
    return Promise.resolve(null);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (this.isBrowser) {
      return Promise.resolve(localStorage.setItem(key, value));
    }
    return Promise.resolve();
  }

  async removeItem(key: string): Promise<void> {
    if (this.isBrowser) {
      return Promise.resolve(localStorage.removeItem(key));
    }
    return Promise.resolve();
  }
}
