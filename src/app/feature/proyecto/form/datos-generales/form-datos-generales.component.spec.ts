import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatosGeneralesComponent } from './form-datos-generales.component';

describe('FormDatosGeneralesComponent', () => {
  let component: FormDatosGeneralesComponent;
  let fixture: ComponentFixture<FormDatosGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDatosGeneralesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
