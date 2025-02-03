import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDownloadDocumentModalComponent } from './tour-download-document-modal.component';

describe('TourDownloadDocumentModalComponent', () => {
  let component: TourDownloadDocumentModalComponent;
  let fixture: ComponentFixture<TourDownloadDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDownloadDocumentModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDownloadDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
