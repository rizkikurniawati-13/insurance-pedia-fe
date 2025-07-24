import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessProcess } from '../business-process/business-process.service';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process-info-dialog',
  templateUrl: './process-info-dialog.component.html',
  styleUrls: ['./process-info-dialog.component.css'],
  standalone: true,
  imports: [MatDividerModule, CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class ProcessInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProcessInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BusinessProcess
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
