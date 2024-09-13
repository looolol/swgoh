import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

interface LoginMethod {
  login(creds: any): Promise<User>;
  logout(): Promise<void>;  
}

export type User = {
  allyCode: string;
  userName: string;
}

class AllyCodeLogin implements LoginMethod {
  constructor(private storageService: StorageService) { }

  async login(allyCode: string): Promise<User> {
    if (allyCode?.length === 9 && /^\d+$/.test(allyCode)) {
      const user: User = {
        allyCode: allyCode,
        userName: 'looolol',
      };
      await this.storageService.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid ally code');
  }

  async logout(): Promise<void> {
    await this.storageService.removeItem('user');
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginMethod: LoginMethod;

  constructor(private storageService: StorageService) {
    this.loginMethod = new AllyCodeLogin(storageService);
  }

  async login(allyCode: string): Promise<User> {
    return this.loginMethod.login(allyCode);
  }

  async logout(): Promise<void> {
    return this.loginMethod.logout();
  }

  async isLoggedIn(): Promise<boolean> {
    const userStr = await this.storageService.getItem('user');
    return userStr !== null;
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = await this.storageService.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
