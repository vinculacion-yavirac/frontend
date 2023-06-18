import { TestBed } from '@angular/core/testing';

import { ProyectoParticipanteHttpService } from './proyecto-participante-http.service';

describe('ProyectoParticipanteHttpService', () => {
  let service: ProyectoParticipanteHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProyectoParticipanteHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
