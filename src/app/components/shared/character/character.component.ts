import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Unit } from '../../../models/team.model';
import { ImageLoadingService } from '../../../services/image-loading/image-loading.service';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterComponent implements OnInit, OnChanges {
  @Input() unit!: Unit;

  stars: {src: string, class: string}[] = [];
  characterImage$: Observable<string | undefined> = of(undefined);
  gearFrameUrl: string = '';

  constructor(
    private imageLoadingService: ImageLoadingService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['unit']) {
      this.initializeComponent();
    }
  }

  private initializeComponent() {
    this.generateStars();
    this.loadImages();
    this.setGearFrameUrl();
    this.cdr.markForCheck();
  }

  loadImages() {
    this.characterImage$ = this.imageLoadingService.getImage(this.unit.characterDefinition.image);
  }

  setGearFrameUrl(): void {
    const gearLevel = this.unit.userUnitData.data.gear_level;
    if (gearLevel === 13) {
      switch (this.unit.characterDefinition.alignment) {
        case 'Light Side':
          this.gearFrameUrl = '/images/gear13light.png';
          break;
        case 'Dark Side':
          this.gearFrameUrl = '/images/gear13dark.png';
          break;
        default:
          this.gearFrameUrl = '/images/gear13.png';
      }
    } else {
      this.gearFrameUrl = `/images/gear${gearLevel}.png`;
    }
  }

  generateStars() {
    const fullStars = this.unit.userUnitData.data.rarity;
    const emptyStars = 7 - fullStars;
    this.stars = [
      ...Array(fullStars).fill({src: '/images/star.png', class: 'full-star'}),
      ...Array(emptyStars).fill({src: '/images/star-empty.png', class: 'empty-star'})
    ];
  }
}
