import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConquestSectorComponent } from './conquest-sector.component';

describe('ConquestSectorComponent', () => {
  let component: ConquestSectorComponent;
  let fixture: ComponentFixture<ConquestSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConquestSectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConquestSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
