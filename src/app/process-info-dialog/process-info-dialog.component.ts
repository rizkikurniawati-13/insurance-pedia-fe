import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessProcess } from '../business-process/business-process.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-process-info-dialog',
  standalone: true,
  templateUrl: './process-info-dialog.component.html',
  imports : [CommonModule, MatDividerModule]
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
