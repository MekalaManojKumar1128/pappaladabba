import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmationComponentComponent } from './order-confirmation-component.component';

describe('OrderConfirmationComponentComponent', () => {
  let component: OrderConfirmationComponentComponent;
  let fixture: ComponentFixture<OrderConfirmationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmationComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderConfirmationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
