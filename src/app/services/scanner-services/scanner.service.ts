import { Injectable } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/library';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  private codeReader = new BrowserMultiFormatReader();

  start(video: HTMLVideoElement, callback: (result: any) => void){

    this.codeReader.decodeFromVideoDevice(
      null,
      video,
      (result) => {
        callback(result);
      }
    );
  }

  reset(){
    this.codeReader.reset();
  }
}
