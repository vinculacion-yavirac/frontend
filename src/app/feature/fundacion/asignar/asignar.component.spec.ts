import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarComponent } from './asignar.component';

describe('AsignarComponent', () => {
  let component: AsignarComponent;
  let fixture: ComponentFixture<AsignarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
