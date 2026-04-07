export class Projectile{
  constructor(
    public x: number,
    public y: number,
    public dx: number,
    public dy: number,
    public radius: number = 8,
    public isActive: boolean
  ){}
}
