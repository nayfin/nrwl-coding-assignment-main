import { TestBed } from '@angular/core/testing';

import { TicketsApiService } from './tickets-api.service';

describe('TicketsApiService', () => {
  let service: TicketsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
