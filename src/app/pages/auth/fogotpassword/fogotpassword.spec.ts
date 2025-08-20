import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fogotpassword } from './fogotpassword';

describe('Fogotpassword', () => {
  let component: Fogotpassword;
  let fixture: ComponentFixture<Fogotpassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fogotpassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fogotpassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
