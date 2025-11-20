import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoidsBackgroundComponent } from "./flock-algorithm/components/boids-background/boids-background.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoidsBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vector-lab-fx';
}
