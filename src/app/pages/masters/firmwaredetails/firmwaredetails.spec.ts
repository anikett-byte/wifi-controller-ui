import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Firmwaredetails } from './firmwaredetails';

describe('Firmwaredetails', () => {
  let component: Firmwaredetails;
  let fixture: ComponentFixture<Firmwaredetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Firmwaredetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Firmwaredetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
