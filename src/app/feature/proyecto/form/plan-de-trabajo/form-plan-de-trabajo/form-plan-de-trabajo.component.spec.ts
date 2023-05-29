import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPlanDeTrabajoComponent } from './form-plan-de-trabajo.component';

describe('FormPlanDeTrabajoComponent', () => {
  let component: FormPlanDeTrabajoComponent;
  let fixture: ComponentFixture<FormPlanDeTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPlanDeTrabajoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPlanDeTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
