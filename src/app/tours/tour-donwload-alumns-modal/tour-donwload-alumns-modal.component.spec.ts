import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDonwloadAlumnsModalComponent } from './tour-donwload-alumns-modal.component';

describe('TourDonwloadAlumnsModalComponent', () => {
  let component: TourDonwloadAlumnsModalComponent;
  let fixture: ComponentFixture<TourDonwloadAlumnsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDonwloadAlumnsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDonwloadAlumnsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
