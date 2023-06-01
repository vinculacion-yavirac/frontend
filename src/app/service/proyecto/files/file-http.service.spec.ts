import { TestBed } from '@angular/core/testing';

import { FileHttpService } from './file-http.service';

describe('FileHttpService', () => {
  let service: FileHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
