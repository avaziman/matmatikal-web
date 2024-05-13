import { Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatSelectModule, MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  grades = [...Array(13).keys()].splice(1).reverse();
}
