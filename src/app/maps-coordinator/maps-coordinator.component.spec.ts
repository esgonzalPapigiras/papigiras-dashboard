import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsCoordinatorComponent } from './maps-coordinator.component';

describe('MapsCoordinatorComponent', () => {
  let component: MapsCoordinatorComponent;
  let fixture: ComponentFixture<MapsCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsCoordinatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
