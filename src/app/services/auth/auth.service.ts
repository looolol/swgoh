import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { User, DEFAULT_USER } from '../../models/user.model';
import { SwgohApiService } from '../swgoh-api/swgoh-api.service';

interface LoginMethod {
  getKey(): string;
  login(creds: any): Promise<User>;
  logout(): Promise<void>;  
}

class AllyCodeLogin implements LoginMethod {
  constructor(
    private storageService: StorageService, 
    private swgohApiService: SwgohApiService
  ) { }

  getKey(): string {
    return 'user';
  }

  async login(allyCode: string): Promise<User> {
    if (allyCode?.length === 9 && /^\d+$/.test(allyCode)) {
      const parsedAllyCode = parseInt(allyCode, 10);

        const user = await this.swgohApiService.getPlayerProfile(parsedAllyCode);

        await this.storageService.setItem(this.getKey(), JSON.stringify(user));
        return user;
    }
    throw new Error('Invalid ally code');
  }

  async logout(): Promise<void> {
    await this.storageService.removeItem(this.getKey());
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginMethod: LoginMethod;

  constructor(
    private storageService: StorageService, 
    private swgohApiService: SwgohApiService
  ) {
    this.loginMethod = new AllyCodeLogin(storageService, swgohApiService);
  }

  async login(allyCode: string): Promise<User> {
    const user = await this.loginMethod.login(allyCode);
    // Emit an event or update an observable to notify components of login
    return user;
  }

  async logout(): Promise<void> {
    await this.loginMethod.logout();
    // Emit an event or update an observable to notify components of logout
  }

  async isLoggedIn(): Promise<boolean> {
    const userStr = await this.storageService.getItem(this.loginMethod.getKey());
    return userStr !== null;
  }

  async getCurrentUser(): Promise<User> {
    const userStr = await this.storageService.getItem(this.loginMethod.getKey());
    return userStr ? JSON.parse(userStr) : DEFAULT_USER;
  }
}
