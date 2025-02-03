import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourAddHotelModalComponent } from './tour-add-hotel-modal.component';

describe('TourAddHotelModalComponent', () => {
  let component: TourAddHotelModalComponent;
  let fixture: ComponentFixture<TourAddHotelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourAddHotelModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourAddHotelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
