import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConquestFeat, ConquestSector} from "../../../models/conquest.model";
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {ConquestService} from "../../../services/conquest/conquest.service";

@Component({
  selector: 'app-conquest-sector',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './conquest-sector.component.html',
  styleUrl: './conquest-sector.component.scss'
})
export class ConquestSectorComponent implements OnInit {

  @Input() sector!: ConquestSector;
  @Input() showCompletedFeats: boolean = false;
  @Output() saveProgress = new EventEmitter<void>();

  featColumns = ['complete', 'desc', 'progress', 'total', 'keycards'];
  bossNodeColumns = ['complete', 'desc', 'keycards'];

  sectorProgress = 0;

  constructor(
    private conquestService: ConquestService
  ) {}

  ngOnInit() {
    this.sectorProgress = this.getSectorProgress();
  }

  getSectorProgress(): number {
    return this.sector.keycardProgress + this.conquestService.getSectorFeatProgress(this.sector);
  }

  getSectorFeatProgress(): number {
    return this.conquestService.getSectorFeatProgress(this.sector);
  }

  getSectorFeats(): ConquestFeat[] {
    return this.showCompletedFeats
      ? this.sector.feats
      : this.sector.feats.filter(feat => !feat.completed);
  }

  getMiniBossNodeFeats(): ConquestFeat[] {
    return this.showCompletedFeats
      ? this.sector.miniBossNode
      : this.sector.miniBossNode.filter(feat => !feat.completed);
  }

  getBossNodeFeats(): ConquestFeat[] {
    return this.showCompletedFeats
      ? this.sector.bossNode
      : this.sector.bossNode.filter(feat => !feat.completed);
  }

  onSectorProgressChange(newValue: number) {
    console.log("Sector Progress Change!", newValue);

    const sectorFeatProgress = this.conquestService.getSectorFeatProgress(this.sector);
    const sectorFeatTotal = this.conquestService.getSectorFeatTotal(this.sector);
    const sectorKeycardTotal = this.sector.total - sectorFeatTotal;
    this.sector.keycardProgress = Math.max(0, Math.min(newValue - sectorFeatProgress, sectorKeycardTotal));

    this.emitSave();
  }

  toggleCompleted(feat: ConquestFeat) {
    feat.completed = !feat.completed;

    const newSectorProgress = feat.completed
      ? this.sectorProgress += feat.keycards
      : this.sectorProgress -= feat.keycards;

    this.sectorProgress = Math.max(this.getSectorFeatProgress(), Math.min(newSectorProgress));

    this.onSectorProgressChange(this.sectorProgress);

    this.emitSave();
  }

  onFeatProgressChange(feat: ConquestFeat, newValue: number) {
    feat.progress = Math.max(0, Math.min(newValue, feat.required));

    if (feat.progress === feat.required) {
      this.toggleCompleted(feat);
    }

    this.emitSave();
  }

  private emitSave() {
    this.saveProgress.emit();
  }



}
