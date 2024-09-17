import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class SwgohApiService {
  private baseUrl = environment.swgoh_api;

  constructor(private http: HttpClient) { }

  private sendRequest(url: string): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const observable = this.http.get(url, { headers }).pipe(
      catchError(this.handleError)
    );

    return firstValueFrom(observable);
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


  async getPlayerProfile(allyCode: number): Promise<User> {
    console.log('allyCode', allyCode);
    console.log('url', `${this.baseUrl}/player/${allyCode}/`);

    const playerProfile = await this.sendRequest(`${this.baseUrl}/player/${allyCode}/`);

    return playerProfile.data;
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
