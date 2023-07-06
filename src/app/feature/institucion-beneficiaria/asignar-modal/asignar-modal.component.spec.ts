import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarModalComponent } from './asignar-modal.component';

describe('AsignarModalComponent', () => {
  let component: AsignarModalComponent;
  let fixture: ComponentFixture<AsignarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
