import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MainNavBarComponent } from '@layouts';
import { Station } from '../../models/station-models/station';
import { RadioService } from '../../services/radio-service/radio.service';
import { Option } from '../../models/station-models/option';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-radio-player',
    standalone: true,
    imports: [MainNavBarComponent],
    templateUrl: './radio-player.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './radio-player.component.css'
})
export class RadioPlayerComponent implements OnInit, OnDestroy{
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>

  constructor(
    private radioService: RadioService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ){ }


  streamUrl = '';

  radioStations: Station [] = [];
  stationObjects: any[] = [];

  options: Option = {
    stationName: "",
    stationCount: 20,
    country: "The United States Of America",
    genre: "",
    language: "english"
  }

  ngOnInit(): void {
    this.generateStations(this.options.stationName, this.options.stationCount, this.options.country, this.options.genre, this.options.language);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {

  }


  selectStation(url: string){
    this.snackBar.open("Press the 'play' button on the mini player to the right to listen to the station.", "", {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    this.streamUrl = url;
    this.initializePlayer();
  }

  private initializePlayer(): void{
    const audio = this.audioPlayer.nativeElement;

    audio.src = this.streamUrl;
    audio.load();

    audio.play().catch(error => {
      console.error('playback failed: ', error);
    });
    console.log("changed station to: " + this.streamUrl);
  }


  async generateStations(sName: string, sCount: number, cName: string, gSelect: string, lSelect: string){
    this.radioStations = [];
    // get the options and set the api url
    await this.getOptionsAsync(sName, sCount, cName, gSelect, lSelect);
    await this.getStationsAsync();

    this.radioStations = this.radioService.sortStations(this.stationObjects);

    this.cdr.detectChanges();
  }

  async getOptionsAsync(sName: string, sCount: number, cName: string, gSelect: string, lSelect: string): Promise<void>{
    if(!cName)
      this.options.country = "The United States Of America";
    else
      this.options.country = cName;
    this.options.genre = gSelect;
    if(!lSelect)
      this.options.language = "english";
    else
      this.options.language = lSelect;
    if(!sCount)
      this.options.stationCount = 20;
    else
      this.options.stationCount = sCount;
    this.options.stationName = sName;
  }

  async getStationsAsync(): Promise<void>{
    this.stationObjects = [];

    const data = await firstValueFrom(
      this.radioService.getStations(this.options)
    );

    console.log("API RESPONSE: ", data);
    this.stationObjects = data;
  }

  getStationByUrl(sUrl: string): void{
    if(sUrl){
      const audio = this.audioPlayer.nativeElement;

      audio.src = sUrl;
      audio.load();
    }
    else{
      this.snackBar.open("The url input is empty..", "", {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }
}
