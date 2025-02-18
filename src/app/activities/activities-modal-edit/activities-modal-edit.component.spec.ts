import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesModalEditComponent } from './activities-modal-edit.component';

describe('ActivitiesModalEditComponent', () => {
  let component: ActivitiesModalEditComponent;
  let fixture: ComponentFixture<ActivitiesModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
