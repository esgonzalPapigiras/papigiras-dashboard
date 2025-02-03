import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourAddCoordinatorModalComponent } from './tour-add-coordinator-modal.component';

describe('TourAddCoordinatorModalComponent', () => {
  let component: TourAddCoordinatorModalComponent;
  let fixture: ComponentFixture<TourAddCoordinatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourAddCoordinatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourAddCoordinatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
