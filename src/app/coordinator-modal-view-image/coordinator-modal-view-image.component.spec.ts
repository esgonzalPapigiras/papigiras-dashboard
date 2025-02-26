import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorModalViewImageComponent } from './coordinator-modal-view-image.component';

describe('CoordinatorModalViewImageComponent', () => {
  let component: CoordinatorModalViewImageComponent;
  let fixture: ComponentFixture<CoordinatorModalViewImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinatorModalViewImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorModalViewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
