import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-process-info-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './process-info-dialog.component.html',
  styleUrl: './process-info-dialog.component.css'
})
export class ProcessInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
