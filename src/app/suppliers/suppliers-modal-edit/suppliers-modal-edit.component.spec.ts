import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersModalEditComponent } from './suppliers-modal-edit.component';

describe('SuppliersModalEditComponent', () => {
  let component: SuppliersModalEditComponent;
  let fixture: ComponentFixture<SuppliersModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
