import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosSolicitudComboboxComponent } from './estados-solicitud-combobox.component';

describe('EstadosSolicitudComboboxComponent', () => {
  let component: EstadosSolicitudComboboxComponent;
  let fixture: ComponentFixture<EstadosSolicitudComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadosSolicitudComboboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadosSolicitudComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
