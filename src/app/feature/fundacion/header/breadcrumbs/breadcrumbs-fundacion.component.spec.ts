import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsFundacionComponent } from './breadcrumbs-fundacion.component';

describe('BreadcrumbsFundaciionComponent', () => {
  let component: BreadcrumbsFundacionComponent;
  let fixture: ComponentFixture<BreadcrumbsFundacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreadcrumbsFundacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
