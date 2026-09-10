import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEMIPolicyComponent } from './payment-emi-policy.component';

describe('PaymentEMIPolicyComponent', () => {
  let component: PaymentEMIPolicyComponent;
  let fixture: ComponentFixture<PaymentEMIPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentEMIPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEMIPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
