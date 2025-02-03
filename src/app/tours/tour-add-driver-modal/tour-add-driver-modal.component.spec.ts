import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourAddDriverModalComponent } from './tour-add-driver-modal.component';

describe('TourAddDriverModalComponent', () => {
  let component: TourAddDriverModalComponent;
  let fixture: ComponentFixture<TourAddDriverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourAddDriverModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourAddDriverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
