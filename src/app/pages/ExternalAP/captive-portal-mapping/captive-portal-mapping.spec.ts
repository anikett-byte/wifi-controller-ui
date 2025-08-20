import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptivePortalMapping } from './captive-portal-mapping';

describe('CaptivePortalMapping', () => {
  let component: CaptivePortalMapping;
  let fixture: ComponentFixture<CaptivePortalMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptivePortalMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptivePortalMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
