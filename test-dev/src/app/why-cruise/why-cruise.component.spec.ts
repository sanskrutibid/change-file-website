import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyCruiseComponent } from './why-cruise.component';

describe('WhyCruiseComponent', () => {
  let component: WhyCruiseComponent;
  let fixture: ComponentFixture<WhyCruiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyCruiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyCruiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
