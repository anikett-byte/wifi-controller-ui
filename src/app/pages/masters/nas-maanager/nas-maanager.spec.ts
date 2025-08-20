import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NasMaanager } from './nas-maanager';

describe('NasMaanager', () => {
  let component: NasMaanager;
  let fixture: ComponentFixture<NasMaanager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasMaanager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NasMaanager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
