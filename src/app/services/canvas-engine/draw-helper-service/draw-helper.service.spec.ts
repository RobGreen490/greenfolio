import { TestBed } from '@angular/core/testing';

import { DrawHelperService } from './draw-helper.service';

describe('DrawHelperService', () => {
  let service: DrawHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
