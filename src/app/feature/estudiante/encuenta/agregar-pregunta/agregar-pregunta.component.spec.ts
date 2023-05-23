import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPreguntaComponent } from './agregar-pregunta.component';

describe('AgregarPreguntaComponent', () => {
  let component: AgregarPreguntaComponent;
  let fixture: ComponentFixture<AgregarPreguntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPreguntaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
