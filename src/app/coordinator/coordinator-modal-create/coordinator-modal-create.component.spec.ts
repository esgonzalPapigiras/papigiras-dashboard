import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorModalCreateComponent } from './coordinator-modal-create.component';

describe('CoordinatorModalCreateComponent', () => {
  let component: CoordinatorModalCreateComponent;
  let fixture: ComponentFixture<CoordinatorModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinatorModalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
