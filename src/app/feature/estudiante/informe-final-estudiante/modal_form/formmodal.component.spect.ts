import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalComponent2 } from './formmodal.component';

describe('ProjectModalComponent', () => {
  let component: FormModalComponent2;
  let fixture: ComponentFixture<FormModalComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormModalComponent2 ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModalComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});