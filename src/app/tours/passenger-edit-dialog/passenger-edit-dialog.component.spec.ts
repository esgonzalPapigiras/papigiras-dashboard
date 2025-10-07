import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerEditDialogComponent } from './passenger-edit-dialog.component';

describe('PassengerEditDialogComponent', () => {
  let component: PassengerEditDialogComponent;
  let fixture: ComponentFixture<PassengerEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
