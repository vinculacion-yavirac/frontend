import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoArchivedComponent } from './proyecto-archived.component';

describe('ProyectoArchivedComponent', () => {
  let component: ProyectoArchivedComponent;
  let fixture: ComponentFixture<ProyectoArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoArchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
