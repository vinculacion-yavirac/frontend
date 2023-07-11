import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfiguracionComponent } from './modal-configuracion.component';

describe('ModalConfiguracionComponent', () => {
  let component: ModalConfiguracionComponent;
  let fixture: ComponentFixture<ModalConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfiguracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
