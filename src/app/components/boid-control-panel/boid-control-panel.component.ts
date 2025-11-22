import { Component, input, InputSignal, output } from '@angular/core';
import { Boid } from '../../models/boid';
import { MovementFactors } from '../../models/movementFactors.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'vector-fx-boid-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boid-control-panel.component.html',
  styleUrl: './boid-control-panel.component.scss',
})
export class BoidControlPanelComponent {
  readonly Boid = Boid;
  readonly MovementFactors = MovementFactors;

  boidsLength: InputSignal<number> = input<number>(0);

  protected toggleSightRadius = output<boolean>();
  protected changeBoidsAmount = output<number>();

  protected readonly boidCountChangeFactor = 100;

  protected showSightRadius: boolean = false;

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
