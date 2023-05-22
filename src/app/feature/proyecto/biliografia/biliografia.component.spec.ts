import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiliografiaComponent } from './biliografia.component';

describe('BiliografiaComponent', () => {
  let component: BiliografiaComponent;
  let fixture: ComponentFixture<BiliografiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiliografiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiliografiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
