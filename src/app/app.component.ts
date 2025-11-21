import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoidsDisplayComponent } from './components/boids-display/boids-display.component';
import { ResumeComponent } from "./components/resume/resume.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoidsDisplayComponent, ResumeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'vector-lab-fx';
}
