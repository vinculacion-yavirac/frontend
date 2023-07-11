import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionArchivedComponent } from './configuracion-archived.component';

describe('ConfiguracionArchivedComponent', () => {
  let component: ConfiguracionArchivedComponent;
  let fixture: ComponentFixture<ConfiguracionArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionArchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
