import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafolioTabsComponent } from './portafolio-tabs.component';

describe('PortafolioTabsComponent', () => {
  let component: PortafolioTabsComponent;
  let fixture: ComponentFixture<PortafolioTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortafolioTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortafolioTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
