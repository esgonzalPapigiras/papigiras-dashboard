import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTourModalComponent } from './new-tour-modal.component';

describe('NewTourModalComponent', () => {
  let component: NewTourModalComponent;
  let fixture: ComponentFixture<NewTourModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTourModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTourModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
