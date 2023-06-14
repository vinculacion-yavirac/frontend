import { TestBed } from '@angular/core/testing';

import { InstitucionBeneficiariaDetalleHttpService } from './institucion-beneficiaria-detalle-http.service';

describe('FundacionDetalleHttpService', () => {
  let service: InstitucionBeneficiariaDetalleHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitucionBeneficiariaDetalleHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
