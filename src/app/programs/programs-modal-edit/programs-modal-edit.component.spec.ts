import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsModalEditComponent } from './programs-modal-edit.component';

describe('ProgramsModalEditComponent', () => {
  let component: ProgramsModalEditComponent;
  let fixture: ComponentFixture<ProgramsModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramsModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramsModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
