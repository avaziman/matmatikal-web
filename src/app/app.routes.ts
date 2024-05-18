import { Data, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartezComponent } from './cartez/cartez.component';
import { SketcherComponent } from './sketcher/sketcher.component';
import { HomeComponent } from './home/home.component';
import { RegisterDetailsComponent } from './register-details/register-details.component';
import { RegisterComponent } from './register/register.component';
// import { PaintComponent } from './paint/paint.component';

export const routes: Routes = [
    { path: 'home', redirectTo: '', pathMatch: 'prefix' },
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterDetailsComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'registering', component: RegisterDetailsComponent },
    // { path: 'paint', component: PaintComponent }
    { path: 'sketch', component: SketcherComponent },
];
