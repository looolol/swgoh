import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmingPlansComponent } from './farming-plans.component';

describe('FarmingPlansComponent', () => {
  let component: FarmingPlansComponent;
  let fixture: ComponentFixture<FarmingPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmingPlansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmingPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
