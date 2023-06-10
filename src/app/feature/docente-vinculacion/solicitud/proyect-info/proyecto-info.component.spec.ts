import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoInfoComponent } from './proyecto-info.component';

describe('ProyectoInfoComponent', () => {
  let component: ProyectoInfoComponent;
  let fixture: ComponentFixture<ProyectoInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
