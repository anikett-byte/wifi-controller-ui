import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateMaster } from './state-master';

describe('StateMaster', () => {
  let component: StateMaster;
  let fixture: ComponentFixture<StateMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
