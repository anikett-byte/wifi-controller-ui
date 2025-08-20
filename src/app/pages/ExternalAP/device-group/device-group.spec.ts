import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceGroup } from './device-group';

describe('DeviceGroup', () => {
  let component: DeviceGroup;
  let fixture: ComponentFixture<DeviceGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
