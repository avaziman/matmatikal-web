import { Component, Input, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-details',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './register-details.component.html',
  // styleUrl: './register-details.component.css'
  styleUrl: '../login/login.component.css'
})
export class RegisterDetailsComponent implements OnInit {

  gradeControl = new FormControl<number | undefined>(undefined, [Validators.required]);
  registerForm = this.formBuilder.group({
    birthday: new FormControl(undefined, [Validators.required]),
    grade: this.gradeControl,
    username: new FormControl(undefined, [Validators.required]),
  });
  @Input() email!: string;
  @Input() password!: string;

  grades = [...Array(13).keys()].splice(1).reverse();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    let passed_values = history.state;
    this.email = passed_values['email'];
    this.password = passed_values['password'];
  }

  onSubmit() {
    console.log("DATA", this.registerForm.value)
  }


  dateChange(event: MatDatepickerInputEvent<Date>) {
    let new_date = event.value;
    if (new_date) {
      let grade = this.calculateGradeFromBirthday(new_date);
      this.gradeControl.setValue(grade);
    }
  }

  calculateGradeFromBirthday(bday: Date): number {
    const FIRST_GRADE_AGE = 6;
    let age = new Date().getFullYear() - bday.getFullYear();
    let grade = age - FIRST_GRADE_AGE;

    return Math.max(1, Math.min(grade, 12));
  }
}