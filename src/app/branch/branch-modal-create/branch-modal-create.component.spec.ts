import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchModalCreateComponent } from './branch-modal-create.component';

describe('BranchModalCreateComponent', () => {
  let component: BranchModalCreateComponent;
  let fixture: ComponentFixture<BranchModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchModalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
