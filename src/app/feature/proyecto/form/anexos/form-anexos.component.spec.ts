import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnexosComponent } from './form-anexos.component';

describe('FormAnexosComponent', () => {
  let component: FormAnexosComponent;
  let fixture: ComponentFixture<FormAnexosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAnexosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAnexosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
