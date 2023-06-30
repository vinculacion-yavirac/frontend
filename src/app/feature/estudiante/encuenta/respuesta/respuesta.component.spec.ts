import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaComponent } from './respuesta.component';

describe('RespuestaComponent', () => {
  let component: RespuestaComponent;
  let fixture: ComponentFixture<RespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
