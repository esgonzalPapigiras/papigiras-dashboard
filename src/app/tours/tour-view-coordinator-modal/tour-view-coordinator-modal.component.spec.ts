import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourViewCoordinatorModalComponent } from './tour-view-coordinator-modal.component';

describe('TourViewCoordinatorModalComponent', () => {
  let component: TourViewCoordinatorModalComponent;
  let fixture: ComponentFixture<TourViewCoordinatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourViewCoordinatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourViewCoordinatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
