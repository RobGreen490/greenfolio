import { TestBed } from '@angular/core/testing';

import { RadioServiceService } from '../radio-service.service';

describe('RadioServiceService', () => {
  let service: RadioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
