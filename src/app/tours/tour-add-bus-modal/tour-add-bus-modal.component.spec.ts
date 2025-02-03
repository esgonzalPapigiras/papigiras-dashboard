import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourAddBusModalComponent } from './tour-add-bus-modal.component';

describe('TourAddBusModalComponent', () => {
  let component: TourAddBusModalComponent;
  let fixture: ComponentFixture<TourAddBusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourAddBusModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourAddBusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
