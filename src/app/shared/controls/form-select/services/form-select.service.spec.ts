import { TestBed } from '@angular/core/testing';

import { FormSelectService } from './form-select.service';

describe('FormSelectService', () => {
  let service: FormSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
