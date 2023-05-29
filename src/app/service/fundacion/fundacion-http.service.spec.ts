import { TestBed } from '@angular/core/testing';

import { FundacionHttpService } from './fundacion-http.service';

describe('FundacionHttpService', () => {
  let service: FundacionHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundacionHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
