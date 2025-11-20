import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoidsBackgroundComponent } from './boids-background.component';

describe('BoidsBackgroundComponent', () => {
  let component: BoidsBackgroundComponent;
  let fixture: ComponentFixture<BoidsBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoidsBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoidsBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
