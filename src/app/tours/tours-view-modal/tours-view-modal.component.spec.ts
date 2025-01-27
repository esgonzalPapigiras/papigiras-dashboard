import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursViewModalComponent } from './tours-view-modal.component';

describe('ToursViewModalComponent', () => {
  let component: ToursViewModalComponent;
  let fixture: ComponentFixture<ToursViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToursViewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToursViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
