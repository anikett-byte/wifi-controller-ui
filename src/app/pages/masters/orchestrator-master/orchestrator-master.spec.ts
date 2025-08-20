import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrchestratorMaster } from './orchestrator-master';

describe('OrchestratorMaster', () => {
  let component: OrchestratorMaster;
  let fixture: ComponentFixture<OrchestratorMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrchestratorMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrchestratorMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
