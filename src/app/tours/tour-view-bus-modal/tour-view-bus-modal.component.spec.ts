import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourViewBusModalComponent } from './tour-view-bus-modal.component';

describe('TourViewBusModalComponent', () => {
  let component: TourViewBusModalComponent;
  let fixture: ComponentFixture<TourViewBusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourViewBusModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourViewBusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
