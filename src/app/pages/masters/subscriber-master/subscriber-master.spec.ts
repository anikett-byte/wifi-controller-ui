import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberMaster } from './subscriber-master';

describe('SubscriberMaster', () => {
  let component: SubscriberMaster;
  let fixture: ComponentFixture<SubscriberMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriberMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriberMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
