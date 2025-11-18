import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerAdultEditDialogComponent } from './passenger-adult-edit-dialog.component';

describe('PassengerAdultEditDialogComponent', () => {
  let component: PassengerAdultEditDialogComponent;
  let fixture: ComponentFixture<PassengerAdultEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerAdultEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerAdultEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
