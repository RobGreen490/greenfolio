import { TestBed } from '@angular/core/testing';

import { LicenseScannerService } from './license-scanner.service';

describe('LicenseScannerService', () => {
  let service: LicenseScannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseScannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
