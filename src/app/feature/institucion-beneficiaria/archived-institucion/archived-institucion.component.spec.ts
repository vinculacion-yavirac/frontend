import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedInstitucionComponent } from './archived-institucion.component';

describe('ArchivedInstitucionComponent', () => {
  let component: ArchivedInstitucionComponent;
  let fixture: ComponentFixture<ArchivedInstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedInstitucionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
