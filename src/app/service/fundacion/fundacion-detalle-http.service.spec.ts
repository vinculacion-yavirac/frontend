import { TestBed } from '@angular/core/testing';

import { FundacionDetalleHttpService } from './fundacion-detalle-http.service';

describe('FundacionDetalleHttpService', () => {
  let service: FundacionDetalleHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundacionDetalleHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
