import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionTabsComponent } from './configuracion-tabs.component';

describe('ConfiguracionTabsComponent', () => {
  let component: ConfiguracionTabsComponent;
  let fixture: ComponentFixture<ConfiguracionTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
