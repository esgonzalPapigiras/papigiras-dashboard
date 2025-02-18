import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunnesModalEditComponent } from './comunnes-modal-edit.component';

describe('ComunnesModalEditComponent', () => {
  let component: ComunnesModalEditComponent;
  let fixture: ComponentFixture<ComunnesModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComunnesModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunnesModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
