import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafolioBreadcrumbsComponent } from './portafolio-breadcrumbs.component';

describe('PortafolioBreadcrumbsComponent', () => {
  let component: PortafolioBreadcrumbsComponent;
  let fixture: ComponentFixture<PortafolioBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortafolioBreadcrumbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortafolioBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
