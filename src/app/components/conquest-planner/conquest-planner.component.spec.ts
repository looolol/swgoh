import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConquestPlannerComponent } from './conquest-planner.component';

describe('ConquestPlannerComponent', () => {
  let component: ConquestPlannerComponent;
  let fixture: ComponentFixture<ConquestPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConquestPlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConquestPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
