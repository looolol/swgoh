import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Mods } from '../../models/mod.model';
import { Datacrons } from '../../models/datacron.model';
import { User } from '../../models/user.model';
import { Units } from '../../models/unit.model';

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

  async getPlayerProfile(allyCode: number): Promise<User> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.data;
  }

  async getUnits(allyCode: number): Promise<Units> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.units;
  }

  async getMods(allyCode: number): Promise<Mods> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.mods;
  }

  async getDatacrons(allyCode: number): Promise<Datacrons> {
    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);
    return playerProfile.datacrons;
  }


  // getCharacters(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/characters/`);
  // }

  // getShips(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/ships/`);
  // }

  // getGear(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/gear/`);
  // }

  // getAbilities(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/abilities/`);
  // }

  // getStatDefinitions(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/stat-definitions/`);
  // }

  // getDatacronAffixTemplateSets(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/datacron-affix-template-sets/`);
  // }

  // getDatacronSets(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/datacron-sets/`);
  // }

  // getDatacronTemplates(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/datacron-templates/`);
  // }

  // getGuildProfile(guildId: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/guild-profile/${guildId}/`);
  // }
}
