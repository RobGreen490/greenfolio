import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RadioServiceService {

  private apiUrl = ''

  constructor() { }


}

/*
  // Base URL for the API
  private apiUrl = 'https://api.worldbank.org/v2/country/';
  constructor( private http: HttpClient ) { }

  // accepts a two-letter country code as an input parameter that returns additional information gathered from the API for the selected country
  getCountry(countryCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${countryCode}?format=json`);
  }
*/
