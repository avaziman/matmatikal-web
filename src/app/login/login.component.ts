import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  registerForm = this.formBuilder.group({
    name: '',
    address: '',
    password: ''
  });

  ngOnInit() {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '794981933073-c59qh87r995625mjrk4iph5m89cd9s03.apps.googleusercontent.com',
        callback: this.googleResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      // @ts-ignore
      google.accounts!.id.renderButton(document!.getElementById('loginBtn')!, { theme: 'outline', size: 'large', width: 200 })
      // @ts-ignore
      // google.accounts.id.prompt();
    }

  }

  async googleResponse(response: CredentialResponse) {
    // your logic goes here
    console.log(response);
  }

  onSubmit() {

  }
  constructor(
    private formBuilder: FormBuilder,
  ) { }
}
