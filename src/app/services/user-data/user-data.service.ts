import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { SwgohApiService } from '../swgoh-api/swgoh-api.service';
import { IUserData, UserData, UserDataType } from '../../models/unit-service.model';
import { Mods } from '../../models/mod.model';
import { Datacrons } from '../../models/datacron.model';
import { Units } from '../../models/unit.model';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private swgohApiService: SwgohApiService,
    private storageService: StorageService
  ) { }

  private getKey(userId: number, userDataType: UserDataType): string {
    return `userData_${userId}_${userDataType}`;
  }

  private getDefaultUserData(userDataType: UserDataType): IUserData {
    return {
      timestamp: 0,
      userDataType: userDataType,
      data: []
    }
  }


  async getUnits(userId: number): Promise<Units> {
    const cachedUnits = await this.getUserDataByType(userId, UserDataType.UNITS);
    if (this.isDataValid(cachedUnits)) {
      return cachedUnits as Units;
    }

    const apiUnits = await this.swgohApiService.getUnits(userId);
    await this.saveUserDataByType(userId, UserDataType.UNITS, apiUnits);
    return apiUnits;
  }

  async getMods(userId: number): Promise<Mods> {
    const cachedMods = await this.getUserDataByType(userId, UserDataType.MODS);
    if (this.isDataValid(cachedMods)) {
      return cachedMods as Mods;
    }

    const apiMods = await this.swgohApiService.getMods(userId);
    await this.saveUserDataByType(userId, UserDataType.MODS, apiMods);
    return apiMods;
  }

  async getDatacrons(userId: number): Promise<Datacrons> {
    const cachedDatacrons = await this.getUserDataByType(userId, UserDataType.DATACRONS);
    if (this.isDataValid(cachedDatacrons)) {
      return cachedDatacrons as Datacrons;
    }

    const apiDatacrons = await this.swgohApiService.getDatacrons(userId);
    await this.saveUserDataByType(userId, UserDataType.DATACRONS, apiDatacrons);
    return apiDatacrons;
  }



  async getUserDataByType(userId: number, userDataType: UserDataType): Promise<IUserData> {
    const userData = await this.storageService.getItem(this.getKey(userId, userDataType));
    return userData ? JSON.parse(userData) : this.getDefaultUserData(userDataType);
  }

  async saveUserDataByType(userId: number, userDataType: UserDataType, userData: IUserData): Promise<void> {
    userData.timestamp = Date.now();
    console.log("Saving user data", userId, userDataType, this.getKey(userId, userDataType));
    await this.storageService.setItem(this.getKey(userId, userDataType), JSON.stringify(userData));
  }

  async deleteUserDataByType(userId: number, userDataType: UserDataType): Promise<void> {
    await this.storageService.removeItem(this.getKey(userId, userDataType));
  }


  async getUserData(userId: number): Promise<UserData> {
    const allUserData: UserData = {} as UserData;

    for (const dataType of Object.values(UserDataType)) {
      allUserData[dataType] = await this.getUserDataByType(userId, dataType);
    }

    return allUserData;
  }

  async saveUserData(userId: number, userData: UserData): Promise<void> {
    const savePromises = Object.entries(userData).map(([dataType, userDataType]) => 
      this.saveUserDataByType(userId, dataType as UserDataType, userDataType)
    );
    await Promise.all(savePromises);
  }

  async deleteUserData(userId: number): Promise<void> {
    const deletePromises = Object.values(UserDataType).map(dataType => 
      this.deleteUserDataByType(userId, dataType)
    );
    await Promise.all(deletePromises);
  }



  private isDataValid(userData: IUserData): boolean {
    if (!environment.production) {
      console.log('Development mode: Always treating data as invalid');
      return false;
    }

    const expirationTime = 60 * 60 * 24 * 1000; // 1 day
    return userData.timestamp > Date.now() - expirationTime;
  }
}
