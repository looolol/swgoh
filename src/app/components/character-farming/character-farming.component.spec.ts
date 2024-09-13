import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFarmingComponent } from './character-farming.component';

describe('CharacterFarmingComponent', () => {
  let component: CharacterFarmingComponent;
  let fixture: ComponentFixture<CharacterFarmingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFarmingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFarmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
