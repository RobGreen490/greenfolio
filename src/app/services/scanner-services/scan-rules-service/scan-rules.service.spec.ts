import { TestBed } from '@angular/core/testing';

import { ScanRulesService } from './scan-rules.service';

describe('ScanRulesService', () => {
  let service: ScanRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
