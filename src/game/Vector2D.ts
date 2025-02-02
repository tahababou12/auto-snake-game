export class Vector2D {
  constructor(public x: number, public y: number) {}

  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y)
  }

  subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y)
  }

  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar)
  }

  normalize(): Vector2D {
    const length = Math.sqrt(this.x * this.x + this.y * this.y)
    if (length === 0) return new Vector2D(0, 0)
    return new Vector2D(this.x / length, this.y / length)
  }

  distance(other: Vector2D): number {
    const dx = this.x - other.x
    const dy = this.y - other.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  clone(): Vector2D {
    return new Vector2D(this.x, this.y)
  }

  lerp(target: Vector2D, t: number): Vector2D {
    return new Vector2D(
      this.x + (target.x - this.x) * t,
      this.y + (target.y - this.y) * t
    )
  }
}
