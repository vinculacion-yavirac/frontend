import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsInstitucionBeneficiariaComponent } from './breadcrumbs-institucion-beneficiaria.component';

describe('BreadcrumbsInstitucionBeneficiariaComponent', () => {
  let component: BreadcrumbsInstitucionBeneficiariaComponent;
  let fixture: ComponentFixture<BreadcrumbsInstitucionBeneficiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreadcrumbsInstitucionBeneficiariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsInstitucionBeneficiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
