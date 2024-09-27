import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Datacron, DatacronAffixTemplate } from '../../models/user-data/datacron.model';
import { User } from '../../models/user-data/user.model';
import { Character, UnitGameData } from '../../models/game-data/character.model';
import { Gear } from '../../models/game-data/gear.model';
import { Ship } from '../../models/game-data/ship.model';
import { Ability } from '../../models/game-data/ability.model';
import { DatacronSet } from '../../models/game-data/datacron-sets.model';
import { Stat } from '../../models/game-data/stat.model';
import { UserUnitData } from '../../models/user-data/unit-user-data.model';
import { Mod } from '../../models/user-data/mod.model';

interface CacheItem {
  timestamp: number;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class SwgohApiService {

  private baseUrl = environment.swgoh_api;
  private cache: { [key: string]: CacheItem} = {};
  private cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(private http: HttpClient) { }

  private async sendRequest(url: string): Promise<any> {
    // Check cache first
    const cachedData = this.getFromCache(url);
    if (cachedData) {
      return cachedData.data;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const observable = this.http.get(url, { headers }).pipe(
      catchError(this.handleError)
    );

    const data = await firstValueFrom(observable);
    this.addToCache(url, data);
    return data;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getFromCache(key: string): CacheItem | null {
    const item = this.cache[key];
    if (item && Date.now() - item.timestamp < this.cacheDuration) {
      return item;
    }
    return null;
  }
 
  private addToCache(key: string, data: any) {
    this.cache[key] = {
      timestamp: Date.now(),
      data: data
    };
  }

  //------------------------------------------------------------------------------------------------- 
  // API Requests
  //-------------------------------------------------------------------------------------------------

  // UserData

  async getPlayerProfile(allyCode: number): Promise<User> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.data;
  }

  async getUnits(allyCode: number): Promise<UserUnitData[]> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.units;
  }

  async getMods(allyCode: number): Promise<Mod[]> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.mods;
  }

  async getDatacrons(allyCode: number): Promise<Datacron[]> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.datacrons;
  }

  // Game Data
  
  async getCharacters(): Promise<Character[]> {
    return this.sendRequest(`${this.baseUrl}/characters/`);
  }

  async getShips(): Promise<Ship[]> {
    return this.sendRequest(`${this.baseUrl}/ships/`);
  }

  async getGear(): Promise<Gear[]> {
    return this.sendRequest(`${this.baseUrl}/gear/`);
  }

  async getAbilities(): Promise<Ability[]> {
    return this.sendRequest(`${this.baseUrl}/abilities/`);
  }

  async getDatacronSets(): Promise<DatacronSet[]> {
    return this.sendRequest(`${this.baseUrl}/datacron-sets/`);
  }

  async getDatacronAffixTemplates(): Promise<DatacronAffixTemplate[]> {
    return this.sendRequest(`${this.baseUrl}/datacron-affix-templates/`);
  }

  async getStatDefinitions(): Promise<Stat[]> {
    return this.sendRequest(`${this.baseUrl}/stat-definitions/`);
  }

  async getUnitGameData(): Promise<UnitGameData[]> {
    return this.sendRequest(`${this.baseUrl}/units/`);
  }

  // getGuild(guildId)
}
