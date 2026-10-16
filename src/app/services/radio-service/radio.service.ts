import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../../models/station-models/station';
import { Option } from '../../models/station-models/option';

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  //https://de1.api.radio-browser.info/json/stations/search?tag=rock&language=english&limit=20&hidebroken=true

  private apiUrl = 'https://de1.api.radio-browser.info/json/stations/search'
  radioStations: Station [] = [];

  constructor(private http: HttpClient) { }

  getStations(options: Option): Observable<any>{
    let url = this.setApiUrl(options);
    return this.http.get<any>(`${url}`);
  }

  sortStations(stationObject: any []): Station[]{
    this.radioStations = [];
    stationObject.forEach(station => {
      let stationObject: Station = {
      changeUuid: station.changeuuid,
      stationUuid: station.stationuuid,
      serverUuid: station.serveruuid,
      stationName: station.name,
      url: station.url,
      urlResolved: station.url_resolved,
      homepage: station.homepage,
      favicon: station.favicon,
      tags: station.tags,
      country: station.country,
      countryCode: station.countrycode,
      iso31662: station.iso_3166_2,
      language: station.language,
      languageCodes: station.languagecodes,
      votes: station.votes,
      lastChangeTime: station.lastchangetime,
      lastChangeTimeIso8601: station.lastchangetime_iso8601,
      codec: station.codec,
      bitRate: station.bitrate,
      hls: station.hls,
      lastCheckTime: station.lastchecktime
      };
      if(stationObject.favicon.length)
        this.radioStations.push(stationObject);
    });

    return this.radioStations;
  }

  setApiUrl(options: Option): string{
    let url = this.apiUrl;
    let counter = 0;
    if(options.country || options.genre || options.language || options.stationCount || options.stationName)
      url += "?";

    if(options.stationName){
      options.stationName = encodeURIComponent(options.stationName);
      url += `name=${options.stationName}`;
      return url;
    }
    if(options.country){
      url += `country=${options.country}`;
      counter++;
    }
    if(options.genre){
      if(counter >= 1)
      {
        url += "&";
        counter--;
      }
      url += `tag=${options.genre}`
      counter++;
    }
    if(options.language){
      if(counter >= 1){
        url += "&";
        counter--;
      }
      url += `language=${options.language}`
      counter++;
    }
    if(options.stationCount){
      if(counter >= 1)
        url += "&";
      counter = 0;
      url += `limit=${options.stationCount}`;
    }

    console.log("The new url is: " + url);
    return url;
  }
}
