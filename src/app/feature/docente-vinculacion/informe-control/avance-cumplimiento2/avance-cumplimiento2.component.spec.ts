import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceCumplimiento2Component } from './avance-cumplimiento2.component';

describe('AvanceCumplimientoComponent', () => {
  let component: AvanceCumplimiento2Component;
  let fixture: ComponentFixture<AvanceCumplimiento2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceCumplimiento2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvanceCumplimiento2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
