import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsInstitucionBeneficiariaComponent } from './tabs-institucion-beneficiaria.component';

describe('TabsInstitucionBeneficiariaComponent', () => {
  let component: TabsInstitucionBeneficiariaComponent;
  let fixture: ComponentFixture<TabsInstitucionBeneficiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsInstitucionBeneficiariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsInstitucionBeneficiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
