import { TestBed } from '@angular/core/testing';

import { UsuarioHttpService } from './usuario-http.service';

describe('UsuarioHttpService', () => {
  let service: UsuarioHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
