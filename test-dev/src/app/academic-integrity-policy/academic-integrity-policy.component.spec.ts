import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicIntegrityPolicyComponent } from './academic-integrity-policy.component';

describe('AcademicIntegrityPolicyComponent', () => {
  let component: AcademicIntegrityPolicyComponent;
  let fixture: ComponentFixture<AcademicIntegrityPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicIntegrityPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicIntegrityPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
