import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncabezadoDosFormComponent } from './encabezado-dos-form.component';

describe('EncabezadoDosFormComponent', () => {
  let component: EncabezadoDosFormComponent;
  let fixture: ComponentFixture<EncabezadoDosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncabezadoDosFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncabezadoDosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
