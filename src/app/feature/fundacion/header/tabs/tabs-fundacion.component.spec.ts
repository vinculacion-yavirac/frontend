import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsFundacionComponent } from './tabs-fundacion.component';

describe('TabsFundacionComponent', () => {
  let component: TabsFundacionComponent;
  let fixture: ComponentFixture<TabsFundacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsFundacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
