import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusModalCreateComponent } from './bus-modal-create.component';

describe('BusModalCreateComponent', () => {
  let component: BusModalCreateComponent;
  let fixture: ComponentFixture<BusModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusModalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
