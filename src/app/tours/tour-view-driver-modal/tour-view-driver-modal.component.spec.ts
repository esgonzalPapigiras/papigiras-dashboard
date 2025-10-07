import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourViewDriverModalComponent } from './tour-view-driver-modal.component';

describe('TourViewDriverModalComponent', () => {
  let component: TourViewDriverModalComponent;
  let fixture: ComponentFixture<TourViewDriverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourViewDriverModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourViewDriverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
