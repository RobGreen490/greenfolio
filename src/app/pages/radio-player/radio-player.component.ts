import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-radio-player',
    standalone: true,
    imports: [],
    templateUrl: './radio-player.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './radio-player.component.css'
})
export class RadioPlayerComponent implements OnInit{

  streamUrl = 'http://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/hls/nonuk/pc_hd_abr_v2/cf/bbc_radio_one.m3u8';

  constructor(){}

  ngOnInit(): void {

  }
}
