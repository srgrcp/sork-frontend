import { TestBed } from '@angular/core/testing';

import { CategoryBrandService } from './category-brand.service';

describe('CategoryBrandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryBrandService = TestBed.get(CategoryBrandService);
    expect(service).toBeTruthy();
  });
});
