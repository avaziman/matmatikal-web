import { Component, Input, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { UserRegisterWeb } from '../../api_bindings/UserRegisterWeb';

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

  gradeControl = this.formBuilder.control<number>(0, [Validators.required]);
  registerForm =
    this.formBuilder.group({
      birthday: [new Date(), { validators: [Validators.required], nonNullable: true }]
      ,
      grade: this.gradeControl,
      username: ['', [Validators.required]],
    });

  @Input() email!: string;
  @Input() password!: string;

  grades = [...Array(13).keys()].splice(1).reverse();

  constructor(private formBuilder: NonNullableFormBuilder, private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    let passed_values = history.state;
    this.email = passed_values['email'];
    this.password = passed_values['password'];

    if (!this.email || !this.password) {
      this.router.navigate(["/register"]);
    }
  }

  onSubmit() {
    // if (!this.registerForm.valid)
    // let val = this.nFormBuilder.rec;
    let val = this.registerForm.value;
    if (!val) { return; }
    console.log("DATA", val)

    let registerData = {
      username: val.username,
      grade: val.grade,
      google_id: null,
      password: this.password,
      email: this.email,
      birthday_date_ymd: [val.birthday?.getFullYear(), val.birthday?.getMonth(), val.birthday?.getDate()]
    } as UserRegisterWeb;
    console.log(registerData)
    this.authService.register(registerData).subscribe({
      next: ok => {
        this.router.navigate(["/sketch"]);
      },
      error: e => {
        console.log(e)
        alert(`Failed to register: ${e}`)
      }
    });
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
