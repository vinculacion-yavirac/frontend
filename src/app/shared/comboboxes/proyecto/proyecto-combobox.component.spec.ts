import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoComboboxComponent } from './proyecto-combobox.component';

describe('ProyectoComboboxComponent', () => {
  let component: ProyectoComboboxComponent;
  let fixture: ComponentFixture<ProyectoComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoComboboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
