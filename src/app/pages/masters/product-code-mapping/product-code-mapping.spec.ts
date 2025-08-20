import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCodeMapping } from './product-code-mapping';

describe('ProductCodeMapping', () => {
  let component: ProductCodeMapping;
  let fixture: ComponentFixture<ProductCodeMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCodeMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCodeMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
