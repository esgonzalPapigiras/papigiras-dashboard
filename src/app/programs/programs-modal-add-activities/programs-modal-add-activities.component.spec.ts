import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsModalAddActivitiesComponent } from './programs-modal-add-activities.component';

describe('ProgramsModalAddActivitiesComponent', () => {
  let component: ProgramsModalAddActivitiesComponent;
  let fixture: ComponentFixture<ProgramsModalAddActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramsModalAddActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramsModalAddActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
