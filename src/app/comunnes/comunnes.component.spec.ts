import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunnesComponent } from './comunnes.component';

describe('ComunnesComponent', () => {
  let component: ComunnesComponent;
  let fixture: ComponentFixture<ComunnesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComunnesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
