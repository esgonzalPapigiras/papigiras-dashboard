import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchModalEditComponent } from './branch-modal-edit.component';

describe('BranchModalEditComponent', () => {
  let component: BranchModalEditComponent;
  let fixture: ComponentFixture<BranchModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
