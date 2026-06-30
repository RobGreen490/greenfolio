import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  private stream!: MediaStream;
  private track!: MediaStreamTrack;

  async startCamera(){
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });

    this.track = this.stream.getVideoTracks()[0];
    return this.stream;
  }

  getStream(){
    return this.stream;
  }

  getTrack(){
    return this.track;
  }

  stopCamera(){
    this.stream?.getTracks().forEach(t => t.stop());
  }

  getCapabilities(){
    const caps = this.track?.getCapabilities?.() as any;
    return caps;
  }

  getSettings(){
    const settings = this.track?.getSettings?.() as any;
    return settings;
  }

  async setTorch(enabled: boolean){
    const caps = this.track?.getCapabilities?.() as any;

    type TorchConstraint = MediaTrackConstraintSet & {
      torch?: boolean;
    };

    if(!caps.torch) return false;

    await this.track.applyConstraints({
      advanced: [{ torch: enabled } as TorchConstraint]
    });

    return true;
  }
}
