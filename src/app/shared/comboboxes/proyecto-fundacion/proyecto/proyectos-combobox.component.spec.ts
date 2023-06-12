import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosComboboxComponent } from './proyectos-combobox.component';

describe('ProyectosComboboxComponent', () => {
  let component: ProyectosComboboxComponent;
  let fixture: ComponentFixture<ProyectosComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectosComboboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectosComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
