import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClientMapping } from './product-client-mapping';

describe('ProductClientMapping', () => {
  let component: ProductClientMapping;
  let fixture: ComponentFixture<ProductClientMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductClientMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductClientMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
