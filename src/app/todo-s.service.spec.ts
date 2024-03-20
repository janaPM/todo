import { TestBed } from '@angular/core/testing';

import { TodoSService } from './todo-s.service';

describe('TodoSService', () => {
  let service: TodoSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
