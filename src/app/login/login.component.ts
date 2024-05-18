import { provideNativeDateAdapter } from '@angular/material/core';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { UserRegisterWeb } from '../../api_bindings/UserRegisterWeb';
import { MatDividerModule } from '@angular/material/divider';

import { ThemeServiceService } from '../theme-service.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../auth.service';
const GOOGLE_CLIEND_ID = '794981933073-c59qh87r995625mjrk4iph5m89cd9s03.apps.googleusercontent.com';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, LowerCasePipe, MatDividerModule, MatIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  registerForm = this.formBuilder.group({
    email: new FormControl(undefined, [
      Validators.required, Validators.email]),
    password: new FormControl(undefined, [
      Validators.required, Validators.minLength(6)])
  });

  @Input() register: boolean = false;
  operation!: string;
  hide: boolean = true;
  alternative_operation!: string;

  renderGoogleButton(darkMode: boolean) {
    // @ts-ignore
    google.accounts.id.renderButton(document!.getElementById('loginBtn')!, {
      theme:
        darkMode ? 'filled_black' : 'outline', size: 'large', width: 200
    })

  }

  ngOnInit() {

    this.operation = this.opToString(this.register);
    this.alternative_operation = this.opToString(!this.register);
    // dynamically load google library
    let node = document.createElement('script');
    node.src = "https://accounts.google.com/gsi/client";
    node.type = 'text/javascript';
    node.async = true;
    node.defer = true;
    document.getElementsByTagName('head')[0].appendChild(node);

    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log("Google LOADED")

      // @ts-ignore
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIEND_ID,
        callback: this.googleResponse.bind(this) as any,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      // @ts-ignore
      // google.accounts.id.prompt();
      this.renderGoogleButton(this.themeService.darkMode)
    }
    this.themeService.emitter.subscribe((darkMode) => {
      this.renderGoogleButton(darkMode)
    })

  }

  async googleResponse(response: CredentialResponse) {
    // your logic goes here
    console.log(response);
    // let res = fetch("http://localhost:8080/google-login", {
    //   method: "post",
    //   body: response.credential
    // })
    this.oauthSignIn();
  }


  oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params: any = {
      'client_id': GOOGLE_CLIEND_ID,
      // 'redirect_uri': document.location,
      'redirect_uri': "http://localhost:4200",
      'response_type': 'token',
      'scope': 'https://www.googleapis.com/auth/user.birthday.read',
      'include_granted_scopes': 'true',
      // 'state': 'pass-through value'
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }
  onSubmit() {
    // let body: UserRegisterWeb = {
    //   // username:
    //   birthday: [birthday.getUTCFullYear(), birthday.getUTCMonth(), birthday.getUTCDate()]
    // }

    if (this.registerForm.valid === false) {
      return;
    }

    let val = this.registerForm.value;
    if (this.register === true) {
      console.log('val', val)
      this.router.navigate(['/registering'], {
        state: {
          email: val.email,
          password: val.password
        }
      });
    } else {
      if (val.email && val.password) {
        this.authService.login(val.email, val.password);
      }
    }
  }

  opToString(register: boolean): string {
    return register ? "Register" : "Login";
  }

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeServiceService,
    private router: Router,
    private authService: AuthService,
  ) { }
}
