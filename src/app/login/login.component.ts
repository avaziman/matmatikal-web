import {provideNativeDateAdapter} from '@angular/material/core';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';

const GOOGLE_CLIEND_ID = '794981933073-c59qh87r995625mjrk4iph5m89cd9s03.apps.googleusercontent.com';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  registerForm = this.formBuilder.group({
    email: '',
    password: ''
  });

  ngOnInit() {
    // dynamically load google library
    let node = document.createElement('script');
    node.src = "https://accounts.google.com/gsi/client";
    node.type = 'text/javascript';
    node.async = true;
    node.defer = true;
    document.getElementsByTagName('head')[0].appendChild(node);  
    // fetch(
    //           `https://people.googleapis.com/v1/people/${res.additionalUserInfo.profile.id}?personFields=birthdays,genders&access_token=${res.credential.accessToken}`
    //       ).then(response => console.log(response))
// var fragmentString = location.hash.substring(1);
//   var params = {};
//   var regex = /([^&=]+)=([^&]*)/g, m;
//   while (m = regex.exec(fragmentString)) {
//     params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
//   }
//   if (Object.keys(params).length > 0 && params['state']) {
//     if (params['state'] == localStorage.getItem('state')) {
//       localStorage.setItem('oauth2-test-params', JSON.stringify(params) );

//       // trySampleRequest();
//     } else {
//       console.log('State mismatch. Possible CSRF attack');
//     }
//   }
  
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
      google.accounts.id.renderButton(document!.getElementById('loginBtn')!, { theme: 'outline', size: 'large', width: 200 })
      // @ts-ignore
      // google.accounts.id.prompt();
    }

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
    console.log("SUB!");
  }
  constructor(
    private formBuilder: FormBuilder,
  ) { }
}
