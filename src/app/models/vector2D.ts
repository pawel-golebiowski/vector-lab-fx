export class Vector2D {
  x: number;
  y: number;

  constructor(vectorX: number = 0, vectorY: number = 0) {
    this.x = vectorX;
    this.y = vectorY;
  }

  addVector(vector: Vector2D): void {
    this.x += vector.x;
    this.y += vector.y;
  }

  subVector(vector: Vector2D): void {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiplyVector(multiplyer: number): void {
    this.x *= multiplyer;
    this.y *= multiplyer;
  }

  getNormalizedVector(): Vector2D {
    const magintude: number = Math.sqrt(this.x * this.x + this.y * this.y);
    if (magintude === 0) {
      return new Vector2D();
    }
    return new Vector2D(this.x / magintude, this.y / magintude);
  }

  getMultiplyedVector(multiplyer: number): Vector2D {
    return new Vector2D(this.x * multiplyer, this.y * multiplyer);
  }

  changePositionX(positionX: number): void {
    this.x = positionX;
  }

  changePositionY(positionY: number): void {
    this.y = positionY;
  }
}
