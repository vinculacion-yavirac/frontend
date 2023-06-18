import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstitucionBeneficiariaComponent } from './list-institucion-beneficiaria.component';

describe('ListInstitucionBeneficiariaComponent', () => {
  let component: ListInstitucionBeneficiariaComponent;
  let fixture: ComponentFixture<ListInstitucionBeneficiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInstitucionBeneficiariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInstitucionBeneficiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
