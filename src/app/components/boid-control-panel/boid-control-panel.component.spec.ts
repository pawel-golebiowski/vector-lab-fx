import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoidControlPanelComponent } from './boid-control-panel.component';

describe('BoidControlPanelComponent', () => {
  let component: BoidControlPanelComponent;
  let fixture: ComponentFixture<BoidControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoidControlPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoidControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
