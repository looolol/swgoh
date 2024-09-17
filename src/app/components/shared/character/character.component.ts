import { Component, Input } from '@angular/core';
import { Unit } from '../../../models/user-data/unit.model';
import { Character } from '../../../models/game-data/character.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {

  @Input() unit!: Unit;
  @Input() characters: Character[] = [];

  character: Character | undefined;

  ngOnInit() {
    console.log("Unit", this.unit);
    this.character = this.characters.find(c => c.base_id === this.unit.data.base_id);
    console.log("Unit Def Found: ", this.unit.data.base_id);
    console.log("Char Def: ", this.character);
    console.log("Gear Frame URL: ", this.gearFrameUrl);
  }

  get gearFrameUrl(): string {
    if (!this.character) return '';

    const gearLevel = this.unit.data.gear_level;

    if (gearLevel === 13) {
      switch (this.character.alignment) {
        case 'Light Side':
          return '/images/gear13light.png';
        case 'Dark Side':
          return '/images/gear13dark.png';
        default:
          return '/images/gear13.png';
      }
    } else {
      return `images/gear${gearLevel}.png`;
    }
  }

}
