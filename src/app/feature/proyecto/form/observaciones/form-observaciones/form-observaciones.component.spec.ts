import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormObservacionesComponent } from './form-observaciones.component';

describe('FormObservacionesComponent', () => {
  let component: FormObservacionesComponent;
  let fixture: ComponentFixture<FormObservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormObservacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
