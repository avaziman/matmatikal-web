import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  registerForm = this.formBuilder.group({
    name: '',
    address: '',
    password: ''
  });

  onSubmit() {

  }
  constructor(
    private formBuilder: FormBuilder,
  ) { }
}
