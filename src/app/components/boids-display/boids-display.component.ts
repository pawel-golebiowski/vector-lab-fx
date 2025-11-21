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
import { BoidControlPanelComponent } from '../boid-control-panel/boid-control-panel.component';
import { SIMULATION_TIME } from '../../../constants';

@Component({
  selector: 'vector-fx-boids-display',
  standalone: true,
  imports: [JsonPipe, CommonModule, FormsModule, BoidControlPanelComponent],
  templateUrl: './boids-display.component.html',
  styleUrl: './boids-display.component.scss',
  host: {
    '(window:resize)': 'onWindowResize()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoidsDisplayComponent implements OnInit, OnDestroy {
  protected boids: Boid[] = [];
  protected selectedBoid: WritableSignal<Boid | null> = signal<Boid | null>(
    null
  );

  protected showSightRadius: boolean = false;

  private largestContentfulPaintTime: number | null = null;

  private subscription: Subscription = new Subscription();

  private readonly BOIDS_NUMBER: number = 150;

  constructor(private changeDetector: ChangeDetectorRef) {}

  private onInitToolsSetup(): void {
    this.addBoids(this.BOIDS_NUMBER);
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
      })
    );
  }

  protected changeBoidsAmount(amountChange: number) {
    if (amountChange > 0) {
      this.addBoids(amountChange);
    } else {
      this.removeBoids(Math.abs(amountChange));
    }
  }

  private addBoids(amountToAdd: number = 1) {
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

    this.checkLCP();
  }

  private removeBoids(amountToRemove: number = 1) {
    this.boids.splice(0, amountToRemove);

    this.checkLCP();
  }

  protected toggleSightRadius(): void {
    this.showSightRadius = !this.showSightRadius;
  }

  private checkLCP(): void {
    let lcp: number | undefined;

    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const last = list.getEntries().pop() as any;
        lcp = last.renderTime || last.loadTime || last.startTime;
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      setTimeout(() => {
        console.log('LCP:', lcp);
        observer.disconnect();
      }, 100);
    } else {
      console.log('PerformanceObserver not supported');
    }
  }
}
