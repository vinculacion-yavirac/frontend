import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActividadesComponent } from './form-actividades.component';

describe('FormActividadesComponent', () => {
  let component: FormActividadesComponent;
  let fixture: ComponentFixture<FormActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormActividadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
