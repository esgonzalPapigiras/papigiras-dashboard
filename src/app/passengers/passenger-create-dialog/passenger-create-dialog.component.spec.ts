import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerCreateDialogComponent } from './passenger-create-dialog.component';

describe('PassengerCreateDialogComponent', () => {
  let component: PassengerCreateDialogComponent;
  let fixture: ComponentFixture<PassengerCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerCreateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
