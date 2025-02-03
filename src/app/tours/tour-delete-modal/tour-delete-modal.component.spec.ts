import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDeleteModalComponent } from './tour-delete-modal.component';

describe('TourDeleteModalComponent', () => {
  let component: TourDeleteModalComponent;
  let fixture: ComponentFixture<TourDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDeleteModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
