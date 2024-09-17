import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwgohApiService {
  private baseUrl = 'https://swgoh.gg/api';

  constructor(private http: HttpClient) { }


  getPlayerProfile(allyCode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/player/${allyCode}/`);
  }


  // getUnits(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/units/`);
  // }

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
