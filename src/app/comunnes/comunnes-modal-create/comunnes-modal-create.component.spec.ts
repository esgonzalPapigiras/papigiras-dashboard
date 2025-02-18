import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunnesModalCreateComponent } from './comunnes-modal-create.component';

describe('ComunnesModalCreateComponent', () => {
  let component: ComunnesModalCreateComponent;
  let fixture: ComponentFixture<ComunnesModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComunnesModalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunnesModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
