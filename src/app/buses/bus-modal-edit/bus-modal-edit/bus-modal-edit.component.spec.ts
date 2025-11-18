import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusModalEditComponent } from './bus-modal-edit.component';

describe('BusModalEditComponent', () => {
  let component: BusModalEditComponent;
  let fixture: ComponentFixture<BusModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
