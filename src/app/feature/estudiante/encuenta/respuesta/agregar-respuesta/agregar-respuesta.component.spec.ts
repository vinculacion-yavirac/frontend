import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarRespuestaComponent } from './agregar-respuesta.component';

describe('AgregarRespuestaComponent', () => {
  let component: AgregarRespuestaComponent;
  let fixture: ComponentFixture<AgregarRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarRespuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
