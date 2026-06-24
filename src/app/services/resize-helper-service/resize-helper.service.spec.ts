import { TestBed } from '@angular/core/testing';

import { ResizeHelperService } from './resize-helper.service';

describe('ResizeHelperService', () => {
  let service: ResizeHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizeHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
