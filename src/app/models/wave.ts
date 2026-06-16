export class Wave{
  constructor(){}

  // will be calculated in the draw
  canvasHeight: number = 0;
  canvasWidth: number = 0;

  // the offset will be used so a solid line isn't drawn on the left side of the screen.
  screenOffset = 10;

  // The actual sine wave ('y' will be properly assigned within the draw() method)
  wave = {
    y: 304,
    length: -0.003,
    amplitude: 200,
    frequency: 0.01
  }

  // a greenish hue for the sin wave color.
  strokeColor = {
    h: 181,
    s: 100,
    l: 38
  }
  // lineColor = 'hsl(181, 100%, 38%)';

  // frequency (movement from right to left) incremented in draw().
  freqIncrement = this.wave.frequency;
  waveLength = 0.05;
  public draw(ctx: CanvasRenderingContext2D): void{
    const isMobile = this.canvasHeight > this.canvasWidth;

    // set the appropriate canvas width and height.
    this.canvasWidth = ctx.canvas.width;
    this.canvasHeight = ctx.canvas.height;
    this.wave.y = this.canvasHeight / 2;

    // this.amplitudeUpdate();
    // this.wavelengthUpdate();

    ctx.fillStyle = 'rgba(13, 14, 18, 0.09)'
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    ctx.beginPath();


    // if mobile, have the sin wave go from top to bottom.
    if(!isMobile){
      ctx.lineWidth = 12;
      ctx.moveTo(-this.screenOffset, this.canvasHeight / 2);
      for(let i = -this.screenOffset; i < (isMobile? this.canvasHeight : this.canvasWidth); i++)
        ctx.lineTo(i, this.wave.y + Math.sin(i * this.wave.length + this.freqIncrement) * this.wave.amplitude * Math.sin(this.freqIncrement));
    }
    // else left to right.
    else{
      ctx.lineWidth = 24;
      ctx.moveTo(this.canvasWidth / 2, -this.screenOffset);
      for(let i = this.screenOffset; i < this.canvasHeight; i++)
        ctx.lineTo(this.canvasWidth / 2 + Math.sin(i * this.wave.length + this.freqIncrement) * this.wave.amplitude * Math.sin(this.freqIncrement), i);
    }


    ctx.strokeStyle = `hsl(${this.strokeColor.h}, ${this.strokeColor.s}%, ${this.strokeColor.l}%)`;
    ctx.stroke();
    this.freqIncrement += this.wave.frequency;
  }


  startAmp = this.wave.amplitude;
  ampDirection = 1;
  randomMaxAmp = Math.floor(Math.random() * 4) + 1;
  prevRandom = this.randomMaxAmp;
  amplitudeUpdate(){
    if(this.wave.amplitude > (this.startAmp *this.randomMaxAmp )){
      this.ampDirection = -1;
      this.prevRandom = this.randomMaxAmp;
      this.randomMaxAmp = Math.floor(Math.random() * 4) + 1;
      if(this.prevRandom == 4 && this.randomMaxAmp == 4)
        this.randomMaxAmp = 2;
    }
    if(this.wave.amplitude < -(this.startAmp * this.randomMaxAmp)){
      this.ampDirection = 1;
      this.prevRandom = this.randomMaxAmp;
      this.randomMaxAmp = Math.floor(Math.random() * 4) + 1;
      if(this.prevRandom == 4 && this.randomMaxAmp == 4)
        this.randomMaxAmp = 2;
    }
    this.wave.amplitude += this.ampDirection;
  }


  waveDirection = -0.001;
  waveSpeed = 0.001;
  wavelengthUpdate() {

    if (this.waveLength >= 0.001) {
      this.waveLength = 0.01;
      this.waveDirection = -this.waveSpeed;
    }

    if (this.waveLength <= -0.001) {
      this.waveLength = -0.01;
      this.waveDirection = this.waveSpeed;
    }
    this.waveLength += this.waveDirection;
  }
}
