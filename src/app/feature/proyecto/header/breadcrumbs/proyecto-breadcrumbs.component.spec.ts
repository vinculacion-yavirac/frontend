import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoBreadcrumbsComponent } from './proyecto-breadcrumbs.component';

describe('ProyectoBreadcrumbsComponent', () => {
  let component: ProyectoBreadcrumbsComponent;
  let fixture: ComponentFixture<ProyectoBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoBreadcrumbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
