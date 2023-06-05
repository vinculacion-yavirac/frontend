import { TestBed } from '@angular/core/testing';

import { AvanceCumplimientoService } from './avance-cumplimiento.service';

describe('AvanceCumplimientoService', () => {
  let service: AvanceCumplimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvanceCumplimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
