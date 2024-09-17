import { Injectable } from '@angular/core';
import { DEFAULT_USER_DATA, UserData } from '../../models/user.model';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private storageService: StorageService) { }

  private getKey(userId: number): string {
    return `userData_${userId}`;
  }

  async getUserData(userId: number): Promise<UserData> {
    const userData = await this.storageService.getItem(this.getKey(userId));
    return userData ? JSON.parse(userData) : DEFAULT_USER_DATA;
  }

  async saveUserData(userId: number, userData: UserData): Promise<void> {
    userData.timestamp = Date.now();
    await this.storageService.setItem(this.getKey(userId), JSON.stringify(userData));
  }

  async deleteUserData(userId: number): Promise<void> {
    await this.storageService.removeItem(this.getKey(userId));
  }

  async isExpired(userId: number): Promise<boolean> { 
    if (!environment.production) {
      console.log('Development mode: Always treating data as expired');
      return true;
    }

    const userData = await this.getUserData(userId);
    const expirationTime = 60 * 60 * 24 * 1000; // 1 day (60 seconds * 60 minutes * 24 hours * 1000 milliseconds)

    console.log('expired?', userData.timestamp < Date.now() - expirationTime);
    return userData.timestamp < Date.now() - expirationTime;
  }
}
