import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIntegrantesComponent } from './form-integrantes.component';

describe('FormIntegrantesComponent', () => {
  let component: FormIntegrantesComponent;
  let fixture: ComponentFixture<FormIntegrantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormIntegrantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormIntegrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
