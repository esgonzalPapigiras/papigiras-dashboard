import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorModalEditComponent } from './coordinator-modal-edit.component';

describe('CoordinatorModalEditComponent', () => {
  let component: CoordinatorModalEditComponent;
  let fixture: ComponentFixture<CoordinatorModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinatorModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
