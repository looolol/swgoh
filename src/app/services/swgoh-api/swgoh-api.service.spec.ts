import { TestBed } from '@angular/core/testing';

import { SwgohApiService } from './swgoh-api.service';

describe('SwgohApiService', () => {
  let service: SwgohApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwgohApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
