import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeConductPolicyComponent } from './code-conduct-policy.component';

describe('CodeConductPolicyComponent', () => {
  let component: CodeConductPolicyComponent;
  let fixture: ComponentFixture<CodeConductPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeConductPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeConductPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
