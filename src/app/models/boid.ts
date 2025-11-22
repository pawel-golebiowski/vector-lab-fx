import { radiansToDegrees } from '../../constants';
import { Vector2D } from './vector2D';

export class Boid {
  private position: Vector2D;
  private velocity: Vector2D;
  private acceleration: Vector2D;
  private rotation: number = 0;
  private windowSize: Vector2D = new Vector2D(
    window.innerWidth,
    window.innerHeight
  );
  private minimumBorder: Vector2D = new Vector2D(
    window.innerWidth * -0.1,
    window.innerHeight * -0.1
  );
  private maximumBorder: Vector2D = new Vector2D(
    window.innerWidth * 1.1,
    window.innerHeight * 1.1
  );

  public static alignmentWage: number = 1.16;
  public static separationWage: number = 0.33;
  public static cohesionWage: number = 0.3;
  public static sightRadius: number = 70.0;

  constructor(velocity: Vector2D = new Vector2D()) {
    this.position = new Vector2D(
      this.windowSize.x * Math.random(),
      this.windowSize.y * Math.random()
    );

    this.velocity = velocity;
    this.acceleration = new Vector2D();
  }

  public update(boids: Boid[]): void {
    this.position.addVector(this.velocity);

    this.checkBorderCrossing();
    this.velocity.multiplyVector(0.9);
    this.velocity.addVector(this.acceleration);

    this.calculateRotation();
    this.calculateAcceleration(boids);
  }

  public onWindowResize() {
    this.windowSize = new Vector2D(window.innerWidth, window.innerHeight);
    this.minimumBorder = new Vector2D(
      window.innerWidth * -0.1,
      window.innerHeight * -0.1
    );
    this.maximumBorder = new Vector2D(
      window.innerWidth * 1.1,
      window.innerHeight * 1.1
    );
  }

  private checkBorderCrossing(): void {
    if (this.position.x < this.minimumBorder.x) {
      this.position.changePositionX(this.maximumBorder.x);
    }

    if (this.position.y < this.minimumBorder.y) {
      this.position.changePositionY(this.maximumBorder.y);
    }

    if (this.position.x > this.maximumBorder.x) {
      this.position.changePositionX(this.minimumBorder.x);
    }

    if (this.position.y > this.maximumBorder.y) {
      this.position.changePositionY(this.minimumBorder.y);
    }
  }

  private calculateAcceleration(boids: Boid[]): void {
    const boidsInSight: Boid[] = boids.filter((boid: Boid) =>
      this.isBoidInSight(boid)
    );

    this.acceleration.multiplyVector(0.1);
    this.acceleration.addVector(
      this.separationFactor(boidsInSight).getMultiplyedVector(
        Boid.separationWage
      )
    );
    this.acceleration.addVector(
      this.alignmentFactor(boidsInSight).getMultiplyedVector(Boid.alignmentWage)
    );
    this.acceleration.addVector(
      this.cohesionFactor(boidsInSight).getMultiplyedVector(Boid.cohesionWage)
    );
    this.acceleration.addVector(this.randomFactor());
  }

  private separationFactor(boidsInSight: Boid[]): Vector2D {
    const separationFactor: Vector2D = new Vector2D();

    let wagesSum: number = 0;
    boidsInSight.forEach((boid: Boid) => {
      let distanceSqrt: number = this.distanceSqrt(
        boid.getPosition(),
        this.position
      );

      const singleSeparationWage: number =
        Boid.sightRadius * Boid.sightRadius - distanceSqrt;
      const destinationPosition: Vector2D = new Vector2D(
        this.position.x - boid.getPosition().x,
        this.position.y - boid.getPosition().y
      );
      separationFactor.addVector(
        destinationPosition.getMultiplyedVector(singleSeparationWage)
      );
      wagesSum += singleSeparationWage * 2;
    });

    return separationFactor
      .getMultiplyedVector(1 / wagesSum)
      .getNormalizedVector();
  }

  private alignmentFactor(boidsInSight: Boid[]): Vector2D {
    const alignmentFactor: Vector2D = new Vector2D();

    boidsInSight.forEach((boid: Boid) => {
      alignmentFactor.addVector(boid.getAcceleration());
    });

    return alignmentFactor.getNormalizedVector();
  }

  private cohesionFactor(boidsInSight: Boid[]): Vector2D {
    let sumPositionX: number = 0;
    let sumPositionY: number = 0;

    boidsInSight.forEach((boid: Boid) => {
      sumPositionX += boid.getPosition().x;
      sumPositionY += boid.getPosition().y;
    });

    const destinationPosition: Vector2D = new Vector2D(
      sumPositionX / boidsInSight.length,
      sumPositionY / boidsInSight.length
    );

    return new Vector2D(
      destinationPosition.x - this.position.x,
      destinationPosition.y - this.position.y
    ).getNormalizedVector();
  }

  private randomFactor(): Vector2D {
    return new Vector2D(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    );
  }

  private isBoidInSight(boid: Boid): boolean {
    return (
      this.distanceSqrt(this.position, boid.getPosition()) <
      Boid.sightRadius * Boid.sightRadius
    );
  }

  private distanceSqrt(vector1: Vector2D, vector2: Vector2D): number {
    return (
      (vector1.x - vector2.x) * (vector1.x - vector2.x) +
      (vector1.y - vector2.y) * (vector1.y - vector2.y)
    );
  }

  private calculateRotation(): void {
    const radians = Math.atan2(this.velocity.x, this.velocity.y);
    this.rotation = (radians * radiansToDegrees + 270) % 360;
  }

  //getters
  public getPosition(): Vector2D {
    return this.position;
  }

  public getVelocity(): Vector2D {
    return this.velocity;
  }

  public getAcceleration(): Vector2D {
    return this.acceleration;
  }

  public getRotation(): number {
    return this.rotation;
  }
}
