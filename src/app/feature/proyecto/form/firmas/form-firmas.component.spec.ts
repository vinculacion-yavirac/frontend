import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFirmasComponent } from './form-firmas.component';

describe('FormFirmasComponent', () => {
  let component: FormFirmasComponent;
  let fixture: ComponentFixture<FormFirmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFirmasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFirmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
