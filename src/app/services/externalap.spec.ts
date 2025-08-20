import { TestBed } from '@angular/core/testing';

import { Externalap } from './externalap';

describe('Externalap', () => {
  let service: Externalap;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Externalap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
