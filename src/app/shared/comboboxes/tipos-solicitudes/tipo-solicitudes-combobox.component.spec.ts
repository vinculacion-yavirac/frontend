import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSolicitudesComboboxComponent } from './tipo-solicitudes-combobox.component';

describe('TipoSolicitudesComboboxComponent', () => {
  let component: TipoSolicitudesComboboxComponent;
  let fixture: ComponentFixture<TipoSolicitudesComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoSolicitudesComboboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSolicitudesComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
