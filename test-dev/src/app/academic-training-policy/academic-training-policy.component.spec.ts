import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicTrainingPolicyComponent } from './academic-training-policy.component';

describe('AcademicTrainingPolicyComponent', () => {
  let component: AcademicTrainingPolicyComponent;
  let fixture: ComponentFixture<AcademicTrainingPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicTrainingPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicTrainingPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
