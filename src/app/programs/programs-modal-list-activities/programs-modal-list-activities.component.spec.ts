import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsModalListActivitiesComponent } from './programs-modal-list-activities.component';

describe('ProgramsModalListActivitiesComponent', () => {
  let component: ProgramsModalListActivitiesComponent;
  let fixture: ComponentFixture<ProgramsModalListActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramsModalListActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramsModalListActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
