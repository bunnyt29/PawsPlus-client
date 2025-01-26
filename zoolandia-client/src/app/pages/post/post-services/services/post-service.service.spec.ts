import { TestBed } from '@angular/core/testing';

import { PostServiceService } from './post-service.service';

describe('PostServicesService', () => {
  let service: PostServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
