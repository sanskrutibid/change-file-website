import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterTrackComponent } from './starter-track.component';

describe('StarterTrackComponent', () => {
  let component: StarterTrackComponent;
  let fixture: ComponentFixture<StarterTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarterTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarterTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
