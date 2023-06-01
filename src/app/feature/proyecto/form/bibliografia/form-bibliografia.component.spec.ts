import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBibliografiaComponent } from './form-bibliografia.component';

describe('FormBibliografiaComponent', () => {
  let component: FormBibliografiaComponent;
  let fixture: ComponentFixture<FormBibliografiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBibliografiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBibliografiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
