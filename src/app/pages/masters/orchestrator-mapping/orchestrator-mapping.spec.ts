import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrchestratorMapping } from './orchestrator-mapping';

describe('OrchestratorMapping', () => {
  let component: OrchestratorMapping;
  let fixture: ComponentFixture<OrchestratorMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrchestratorMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrchestratorMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
