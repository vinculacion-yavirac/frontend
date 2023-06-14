import { TestBed } from '@angular/core/testing';

import { InstitucionBeneficiariaHttpService } from './institucion-beneficiaria-http.service';

describe('FundacionHttpService', () => {
  let service: InstitucionBeneficiariaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitucionBeneficiariaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
