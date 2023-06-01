import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFundacionComponent } from './list-fundacion.component';

describe('ListFundacionComponent', () => {
  let component: ListFundacionComponent;
  let fixture: ComponentFixture<ListFundacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFundacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
