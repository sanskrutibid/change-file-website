import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceRedressalPolicyComponent } from './grievance-redressal-policy.component';

describe('GrievanceRedressalPolicyComponent', () => {
  let component: GrievanceRedressalPolicyComponent;
  let fixture: ComponentFixture<GrievanceRedressalPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievanceRedressalPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceRedressalPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
