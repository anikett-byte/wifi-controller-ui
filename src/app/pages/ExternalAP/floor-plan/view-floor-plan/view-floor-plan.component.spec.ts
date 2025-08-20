import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFloorPlanComponent } from './view-floor-plan.component';

describe('ViewFloorPlanComponent', () => {
  let component: ViewFloorPlanComponent;
  let fixture: ComponentFixture<ViewFloorPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFloorPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFloorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
