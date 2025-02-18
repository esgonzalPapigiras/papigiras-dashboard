import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesModalCreateComponent } from './activities-modal-create.component';

describe('ActivitiesModalCreateComponent', () => {
  let component: ActivitiesModalCreateComponent;
  let fixture: ComponentFixture<ActivitiesModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesModalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
