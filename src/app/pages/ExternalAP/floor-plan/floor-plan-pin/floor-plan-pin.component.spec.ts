import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorPlanPinComponent } from './floor-plan.component';

describe('FloorPlanPinComponent', () => {
  let component: FloorPlanPinComponent;
  let fixture: ComponentFixture<FloorPlanPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorPlanPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorPlanPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
