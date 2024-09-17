import { Component, Input, OnInit } from '@angular/core';
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
export class CharacterComponent implements OnInit {
  @Input() unit!: Unit;
  @Input() characters: Character[] = [];

  character: Character | undefined;
  stars: {src: string, class: string} [] = [];
  imageLoaded = false;

  ngOnInit() {
    this.character = this.characters.find(c => c.base_id === this.unit.data.base_id);
    this.generateStars();
  }

  onImageLoad() {
    this.imageLoaded = true;
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

  generateStars() {
    const fullStars = this.unit.data.rarity;
    const emptyStars = 7 - fullStars;
    this.stars = [
      ...Array(fullStars).fill({src: '/images/star.png', class: 'full-star'}),
      ...Array(emptyStars).fill({src: '/images/star-empty.png', class: 'empty-star'})
    ];
  }
}
