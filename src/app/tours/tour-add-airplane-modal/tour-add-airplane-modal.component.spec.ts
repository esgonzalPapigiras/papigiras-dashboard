import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourAddAirplaneModalComponent } from './tour-add-airplane-modal.component';

describe('TourAddAirplaneModalComponent', () => {
  let component: TourAddAirplaneModalComponent;
  let fixture: ComponentFixture<TourAddAirplaneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourAddAirplaneModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourAddAirplaneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
