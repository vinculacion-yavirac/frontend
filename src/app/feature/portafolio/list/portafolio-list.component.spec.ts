import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafolioListComponent } from './portafolio-list.component';

describe('PortafolioListComponent', () => {
  let component: PortafolioListComponent;
  let fixture: ComponentFixture<PortafolioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortafolioListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortafolioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
