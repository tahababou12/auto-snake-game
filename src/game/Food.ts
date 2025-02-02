import { Vector2D } from './Vector2D'

export class Food {
  constructor(public position: Vector2D) {}

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FF4444'
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, 8, 0, Math.PI * 2)
    ctx.fill()
  }
}
