import { TestBed } from '@angular/core/testing';

import { DocumentoHttpService } from './documento-http.service';

describe('DocumentoHttpService', () => {
  let service: DocumentoHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
