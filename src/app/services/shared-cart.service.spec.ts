import { TestBed } from '@angular/core/testing';

import { SharedCartService } from './shared-cart.service';

describe('SharedCartService', () => {
  let service: SharedCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
