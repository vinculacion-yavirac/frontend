import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundacionTutorComponent } from './fundacion-tutor.component';

describe('FundacionTutorComponent', () => {
  let component: FundacionTutorComponent;
  let fixture: ComponentFixture<FundacionTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundacionTutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundacionTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
