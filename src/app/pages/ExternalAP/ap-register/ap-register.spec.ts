import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApRegister } from './ap-register';

describe('ApRegister', () => {
  let component: ApRegister;
  let fixture: ComponentFixture<ApRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
