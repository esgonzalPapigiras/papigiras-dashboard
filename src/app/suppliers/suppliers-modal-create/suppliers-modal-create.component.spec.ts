import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersModalCreateComponent } from './suppliers-modal-create.component';

describe('SuppliersModalCreateComponent', () => {
  let component: SuppliersModalCreateComponent;
  let fixture: ComponentFixture<SuppliersModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersModalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
