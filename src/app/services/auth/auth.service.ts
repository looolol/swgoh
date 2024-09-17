import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { DEFAULT_USER, DEFAULT_USER_DATA, User } from '../../models/user.model';

interface LoginMethod {
  login(creds: any): Promise<User>;
  logout(): Promise<void>;  
}

class AllyCodeLogin implements LoginMethod {
  constructor(private storageService: StorageService) { }

  async login(allyCode: string): Promise<User> {
    if (allyCode?.length === 9 && /^\d+$/.test(allyCode)) {
      const user: User = {
        allyCode: allyCode,
        userName: `Player${allyCode}`, // Generate a default username
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
    const user = await this.loginMethod.login(allyCode);
    // Emit an event or update an observable to notify components of login
    return user;
  }

  async logout(): Promise<void> {
    await this.loginMethod.logout();
    // Emit an event or update an observable to notify components of logout
  }

  async isLoggedIn(): Promise<boolean> {
    const userStr = await this.storageService.getItem('user');
    return userStr !== null;
  }

  async getCurrentUser(): Promise<User> {
    const userStr = await this.storageService.getItem('user');
    return userStr ? JSON.parse(userStr) : DEFAULT_USER;
  }
}
