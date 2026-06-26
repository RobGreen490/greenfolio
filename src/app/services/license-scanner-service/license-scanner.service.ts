import { Injectable } from '@angular/core';
import{
  BrowserMultiFormatReader,
  NotFoundException,
  BarcodeFormat,
  DecodeHintType
} from '@zxing/library'

@Injectable({
  providedIn: 'root'
})
export class LicenseScannerService {

  private codeReader: BrowserMultiFormatReader;

  constructor() {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.PDF_417,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.DATA_MATRIX
    ]);

    this.codeReader = new BrowserMultiFormatReader(hints);
   }

   async scanFromVideo(videoElement: HTMLVideoElement): Promise<string>{
    return new Promise((resolve, reject) => {
      this.codeReader.decodeFromVideoDevice(
        null,
        videoElement,
        (result, err) => {
          if(result){
            this.codeReader.reset();
            resolve(result.getText());
          }

          if(err && (err instanceof NotFoundException)){
            reject(err);
          }
        }
      );
    });
   }

   stop(){
    this.codeReader.reset();
   }
}
