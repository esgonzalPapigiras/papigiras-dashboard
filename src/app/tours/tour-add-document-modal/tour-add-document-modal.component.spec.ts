import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourAddDocumentModalComponent } from './tour-add-document-modal.component';

describe('TourAddDocumentModalComponent', () => {
  let component: TourAddDocumentModalComponent;
  let fixture: ComponentFixture<TourAddDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourAddDocumentModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourAddDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
