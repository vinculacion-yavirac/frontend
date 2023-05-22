import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoTabsComponent } from './proyecto-tabs.component';

describe('ProyectoTabsComponent', () => {
  let component: ProyectoTabsComponent;
  let fixture: ComponentFixture<ProyectoTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
