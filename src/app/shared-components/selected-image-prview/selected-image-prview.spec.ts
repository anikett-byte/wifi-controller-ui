import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedImagePrview } from './selected-image-prview';

describe('SelectedImagePrview', () => {
  let component: SelectedImagePrview;
  let fixture: ComponentFixture<SelectedImagePrview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedImagePrview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedImagePrview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
