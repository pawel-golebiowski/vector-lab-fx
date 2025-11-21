import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoidsDisplayComponent } from './boids-display.component';

describe('BoidsBackgroundComponent', () => {
  let component: BoidsDisplayComponent;
  let fixture: ComponentFixture<BoidsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoidsDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoidsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
