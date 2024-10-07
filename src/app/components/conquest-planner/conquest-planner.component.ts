import {Component, OnInit} from '@angular/core';
import {ConquestService} from "../../services/conquest/conquest.service";
import {ConquestStore} from "../../models/conquest.model";
import {allConquestSectors} from "../../models/conquest-feats";
import {CommonModule} from "@angular/common";
import {ConquestSectorComponent} from "./conquest-sector/conquest-sector.component";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-conquest-planner',
  standalone: true,
  imports: [
    CommonModule,
    ConquestSectorComponent,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './conquest-planner.component.html',
  styleUrl: './conquest-planner.component.scss'
})
export class ConquestPlannerComponent implements OnInit {

  conquestStore: ConquestStore = allConquestSectors;

  showCompletedFeats = true;

  constructor(
    private conquestService: ConquestService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.conquestStore = await this.conquestService.getStore();
    this.conquestStore.keycardProgress = this.conquestService.getStoreFeatProgress(this.conquestStore);
  }

  getConquestSectors() {
    return this.conquestService.getSectors(this.conquestStore);
  }

  toggleCompletedFeats() {
    this.showCompletedFeats = !this.showCompletedFeats;
  }

  resetCompletedFeats() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.conquestStore = allConquestSectors;
        this.onSaveProgress();
      }
    });
  }

  async onProgressChange(newValue: number) {
    console.log("Progress Change!", newValue);
    this.conquestStore.keycardProgress
    await this.onSaveProgress();
  }

  async onSaveProgress() {
    await this.conquestService.saveStore(this.conquestStore);
  }
}
