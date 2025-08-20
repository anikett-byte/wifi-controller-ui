import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMaster } from './device-master';

describe('DeviceMaster', () => {
  let component: DeviceMaster;
  let fixture: ComponentFixture<DeviceMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
