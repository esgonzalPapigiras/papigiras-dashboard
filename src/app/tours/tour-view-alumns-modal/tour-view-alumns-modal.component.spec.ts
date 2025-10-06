import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourViewAlumnsModalComponent } from './tour-view-alumns-modal.component';

describe('TourViewAlumnsModalComponent', () => {
  let component: TourViewAlumnsModalComponent;
  let fixture: ComponentFixture<TourViewAlumnsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourViewAlumnsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourViewAlumnsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
