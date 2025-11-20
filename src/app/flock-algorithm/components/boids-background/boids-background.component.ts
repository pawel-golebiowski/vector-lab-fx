import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Boid } from '../../models/boid';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Observable, Subscription, tap } from 'rxjs';
import { MovementFactors } from '../../models/movementFactors.enum';
import { SIMULATION_TIME } from '../../../../constants';

@Component({
  selector: 'vector-fx-boids-background',
  standalone: true,
  imports: [JsonPipe, CommonModule, FormsModule],
  templateUrl: './boids-background.component.html',
  styleUrl: './boids-background.component.scss',
  host: {
    '(window:resize)': 'onWindowResize()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoidsBackgroundComponent implements OnInit, OnDestroy {
  protected boids: Boid[] = [];
  protected selectedBoid: WritableSignal<Boid | null> = signal<Boid | null>(
    null
  );
  protected showSightRadius = false;

  private subscription: Subscription = new Subscription();
  readonly Boid = Boid;
  readonly MovementFactors = MovementFactors;

  constructor(private changeDetector: ChangeDetectorRef) {}

  private onInitToolsSetup(): void {
    this.addBoids(240);
  }

  ngOnInit(): void {
    this.onInitToolsSetup();

    this.subscription.add(
      this.defineSimulationSpeed(SIMULATION_TIME).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected selectBoid(index: number) {
    this.selectedBoid.set(this.boids[index] ?? null);
  }

  protected calcPositionX(boid: Boid): string {
    return 'calc(50% + ' + '5px + ' + boid.getPosition().x + 'px)';
  }

  protected calcPositionY(boid: Boid): string {
    return 'calc(50% + ' + '5px + ' + boid.getPosition().y + 'px)';
  }

  protected onWindowResize() {
    this.boids.forEach((boid) => boid.onWindowResize());
  }

  private defineSimulationSpeed(simulationSpeedMs: number): Observable<number> {
    return interval(simulationSpeedMs).pipe(
      tap(() => {
        this.boids.forEach((boid: Boid, index: number) => {
          boid.update(this.boids);
        });
        this.changeDetector.markForCheck();
        console.log('refresh');
      })
    );
  }

  protected addBoids(amountToAdd: number = 1) {
    for (let i = 0; i < amountToAdd; i++) {
      this.boids.push(new Boid());
    }
    setTimeout(() => {
      const elementList: NodeList = document.querySelectorAll('.fx-boid');
      elementList.forEach((el) => {
        (el as any).style.setProperty(
          '--circle-radius',
          Boid.sightRadius + 'px'
        );
      });
    }, 100);
  }

  protected changeMovementFactor(event: any, factor: MovementFactors) {
    switch (factor) {
      case MovementFactors.alignmentWage:
        Boid.alignmentWage = event.target.value;
        break;
      case MovementFactors.separationWage:
        Boid.separationWage = event.target.value;
        break;
      case MovementFactors.cohesionWage:
        Boid.cohesionWage = event.target.value;
        break;
      case MovementFactors.sightRadius:
        const elementList: NodeList = document.querySelectorAll('.fx-boid');
        elementList.forEach((el) => {
          (el as any).style.setProperty(
            '--circle-radius',
            event.target.value + 'px'
          );
        });
        Boid.sightRadius = event.target.value;
        break;
      default:
        break;
    }
  }
}
