import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-upload-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule],
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.css'
})
export class UploadDialogComponent {
  name?: string
}
