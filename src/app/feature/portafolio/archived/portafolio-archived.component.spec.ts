import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafolioArchivedComponent } from './portafolio-archived.component';

describe('PortafolioArchivedComponent', () => {
  let component: PortafolioArchivedComponent;
  let fixture: ComponentFixture<PortafolioArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortafolioArchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortafolioArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
