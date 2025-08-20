import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMaster } from './country-master';

describe('CountryMaster', () => {
  let component: CountryMaster;
  let fixture: ComponentFixture<CountryMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
