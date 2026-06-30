import { Injectable } from '@angular/core';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  private codeReader = new BrowserMultiFormatReader();

  start(stream: MediaStream,video: HTMLVideoElement, callback: (result: any) => void){
  this.codeReader.decodeFromStream(stream, video, (result) => {
    callback(result);
  })
  }

  reset(){
    this.codeReader.reset();
  }
}
