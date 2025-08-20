import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NasMapping } from './nas-mapping';

describe('NasMapping', () => {
  let component: NasMapping;
  let fixture: ComponentFixture<NasMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NasMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
