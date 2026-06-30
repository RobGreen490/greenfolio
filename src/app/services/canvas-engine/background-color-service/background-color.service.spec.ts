import { TestBed } from '@angular/core/testing';

import { BackgroundColorService } from './background-color.service';

describe('BackgroundColorService', () => {
  let service: BackgroundColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
