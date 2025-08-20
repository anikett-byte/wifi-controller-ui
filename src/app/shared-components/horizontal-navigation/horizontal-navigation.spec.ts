import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalNavigation } from './horizontal-navigation';

describe('HorizontalNavigation', () => {
  let component: HorizontalNavigation;
  let fixture: ComponentFixture<HorizontalNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
