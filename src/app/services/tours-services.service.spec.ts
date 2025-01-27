import { TestBed } from '@angular/core/testing';

import { ToursServicesService } from './tours-services.service';

describe('ToursServicesService', () => {
  let service: ToursServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToursServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
