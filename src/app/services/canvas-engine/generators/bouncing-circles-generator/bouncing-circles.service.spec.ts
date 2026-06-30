import { TestBed } from '@angular/core/testing';

import { BouncingCirclesService } from './bouncing-circles.service';

describe('BouncingCirclesService', () => {
  let service: BouncingCirclesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BouncingCirclesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
