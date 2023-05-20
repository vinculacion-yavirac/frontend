import { TestBed } from '@angular/core/testing';

import { PermisoHttpService } from './permiso-http.service';

describe('PermisoHttpService', () => {
  let service: PermisoHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisoHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
