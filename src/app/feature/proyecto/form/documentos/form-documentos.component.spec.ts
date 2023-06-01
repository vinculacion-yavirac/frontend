import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocumentosComponent } from './form-documentos.component';

describe('FormDocumentosComponent', () => {
  let component: FormDocumentosComponent;
  let fixture: ComponentFixture<FormDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDocumentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
