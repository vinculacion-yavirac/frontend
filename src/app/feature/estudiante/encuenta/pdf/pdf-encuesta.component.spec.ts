import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfEncuestaComponent } from './pdf-encuesta.component';

describe('PdfEncuestaComponent', () => {
  let component: PdfEncuestaComponent;
  let fixture: ComponentFixture<PdfEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfEncuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
