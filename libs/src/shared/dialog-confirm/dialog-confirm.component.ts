import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  imports: [MatCardModule],
})
export class DialogConfirmComponent {
  constructor(private dialogRef: MatDialogRef<DialogConfirmComponent>) {}
  data = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
