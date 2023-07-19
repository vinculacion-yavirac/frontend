import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstudianteComponent } from './list-estudiante.component';

describe('ListEstudianteComponent', () => {
  let component: ListEstudianteComponent;
  let fixture: ComponentFixture<ListEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
