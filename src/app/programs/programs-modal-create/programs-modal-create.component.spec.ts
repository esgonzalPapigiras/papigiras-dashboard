import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsModalCreateComponent } from './programs-modal-create.component';

describe('ProgramsModalCreateComponent', () => {
  let component: ProgramsModalCreateComponent;
  let fixture: ComponentFixture<ProgramsModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramsModalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramsModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
