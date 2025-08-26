import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCartViewComponent } from './shared-cartview.component';

describe('SharedCartViewComponent', () => {
  let component: SharedCartViewComponent;
  let fixture: ComponentFixture<SharedCartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCartViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedCartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
