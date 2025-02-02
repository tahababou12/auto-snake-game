import { Snake } from './Snake'
import { Food } from './Food'
import { Vector2D } from './Vector2D'

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private snakes: Snake[] = []
  private foods: Food[] = []
  private lastTime: number = 0
  private running: boolean = false

  constructor(canvasId: string, width: number, height: number) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')!
    this.canvas.width = width
    this.canvas.height = height
    
    // Initialize snakes with different colors
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']
    for (let i = 0; i < 4; i++) {
      const startPos = new Vector2D(
        Math.random() * (width - 100) + 50,
        Math.random() * (height - 100) + 50
      )
      this.snakes.push(new Snake(startPos, colors[i], this))
    }

    // Add initial food
    for (let i = 0; i < 10; i++) {
      this.addFood()
    }
  }

  public start(): void {
    this.running = true
    requestAnimationFrame(this.gameLoop.bind(this))
  }

  private gameLoop(timestamp: number): void {
    const deltaTime = timestamp - this.lastTime
    this.lastTime = timestamp

    this.update(deltaTime)
    this.render()

    if (this.running) {
      requestAnimationFrame(this.gameLoop.bind(this))
    }
  }

  private update(deltaTime: number): void {
    // Update all snakes
    this.snakes.forEach(snake => snake.update(deltaTime))

    // Check collisions
    this.checkCollisions()

    // Maintain food supply
    while (this.foods.length < 10) {
      this.addFood()
    }

    // Update stats
    this.updateStats()
  }

  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a1a'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Render food
    this.foods.forEach(food => food.render(this.ctx))

    // Render snakes
    this.snakes.forEach(snake => snake.render(this.ctx))
  }

  private checkCollisions(): void {
    // Check snake-food collisions
    this.snakes.forEach(snake => {
      this.foods = this.foods.filter(food => {
        if (food.position.distance(snake.getHead()) < 15) {
          snake.grow()
          return false
        }
        return true
      })
    })

    // Check snake-snake collisions
    this.snakes.forEach(snake => {
      if (snake.checkWallCollision(this.canvas.width, this.canvas.height)) {
        snake.reset()
      }
      
      this.snakes.forEach(otherSnake => {
        if (snake !== otherSnake && snake.checkSnakeCollision(otherSnake)) {
          snake.reset()
        }
      })
    })
  }

  private addFood(): void {
    const position = new Vector2D(
      Math.random() * (this.canvas.width - 20) + 10,
      Math.random() * (this.canvas.height - 20) + 10
    )
    this.foods.push(new Food(position))
  }

  private updateStats(): void {
    const statsDiv = document.getElementById('snakeStats')
    if (statsDiv) {
      statsDiv.innerHTML = this.snakes
        .map((snake, i) => `
          <div class="snake-stat" style="color: ${snake.color}">
            Snake ${i + 1}: Length ${snake.getLength()} | Score ${snake.getScore()}
          </div>
        `)
        .join('')
    }
  }

  public getFoods(): Food[] {
    return this.foods
  }

  public getSnakes(): Snake[] {
    return this.snakes
  }

  public getCanvas(): { width: number; height: number } {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    }
  }
}
