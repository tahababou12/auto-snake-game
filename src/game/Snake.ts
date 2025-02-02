import { Vector2D } from './Vector2D'
import { Game } from './Game'

export class Snake {
  private segments: Vector2D[] = []
  private velocity: Vector2D = new Vector2D(0.2, 0) // Initialize with default direction
  private targetDirection: Vector2D = new Vector2D(0.2, 0) // Initialize with default direction
  private speed: number = 0.2
  private growing: number = 0
  private score: number = 0
  private readonly initialLength: number = 5

  constructor(
    startPosition: Vector2D,
    public readonly color: string,
    private game: Game
  ) {
    this.reset(startPosition)
  }

  public reset(startPosition?: Vector2D): void {
    if (!startPosition) {
      const canvas = this.game.getCanvas()
      startPosition = new Vector2D(
        Math.random() * (canvas.width - 100) + 50,
        Math.random() * (canvas.height - 100) + 50
      )
    }

    this.segments = []
    for (let i = 0; i < this.initialLength; i++) {
      this.segments.push(startPosition.clone())
    }
    
    this.velocity = new Vector2D(this.speed, 0)
    this.targetDirection = this.velocity.clone()
    this.score = 0
  }

  public update(deltaTime: number): void {
    this.think()
    
    // Update position
    const movement = this.velocity.multiply(deltaTime)
    const newHead = this.segments[0].add(movement)
    
    this.segments.unshift(newHead)
    
    if (this.growing > 0) {
      this.growing--
    } else {
      this.segments.pop()
    }
  }

  private think(): void {
    const head = this.getHead()
    const foods = this.game.getFoods()
    const otherSnakes = this.game.getSnakes().filter(s => s !== this)
    
    // Find closest food
    let closestFood = foods[0]
    let closestDist = Infinity
    
    foods.forEach(food => {
      const dist = food.position.distance(head)
      if (dist < closestDist) {
        closestDist = dist
        closestFood = food
      }
    })

    if (closestFood) {
      // Calculate direction to food
      const directionToFood = closestFood.position.subtract(head).normalize()
      
      // Check if moving towards food would cause collision
      const potentialPosition = head.add(directionToFood.multiply(20))
      let dangerous = false

      // Avoid walls
      const canvas = this.game.getCanvas()
      if (
        potentialPosition.x < 10 || 
        potentialPosition.x > canvas.width - 10 ||
        potentialPosition.y < 10 || 
        potentialPosition.y > canvas.height - 10
      ) {
        dangerous = true
      }

      // Avoid other snakes
      otherSnakes.forEach(snake => {
        snake.segments.forEach(segment => {
          if (segment.distance(potentialPosition) < 20) {
            dangerous = true
          }
        })
      })

      if (!dangerous) {
        this.targetDirection = directionToFood
      } else {
        // Evasive maneuver
        this.targetDirection = new Vector2D(
          Math.cos(Math.random() * Math.PI * 2),
          Math.sin(Math.random() * Math.PI * 2)
        )
      }
    }

    // Smooth turning
    this.velocity = this.velocity.lerp(this.targetDirection, 0.1).normalize().multiply(this.speed)
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color
    
    // Draw segments
    this.segments.forEach((segment, i) => {
      const size = i === 0 ? 15 : 12
      ctx.beginPath()
      ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  public grow(): void {
    this.growing += 3
    this.score += 10
  }

  public getHead(): Vector2D {
    return this.segments[0]
  }

  public checkWallCollision(width: number, height: number): boolean {
    const head = this.getHead()
    return (
      head.x < 0 ||
      head.x > width ||
      head.y < 0 ||
      head.y > height
    )
  }

  public checkSnakeCollision(other: Snake): boolean {
    const head = this.getHead()
    return other.segments.some(segment => 
      segment.distance(head) < 12
    )
  }

  public getLength(): number {
    return this.segments.length
  }

  public getScore(): number {
    return this.score
  }
}
