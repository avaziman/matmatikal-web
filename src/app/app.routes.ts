import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartezComponent } from './cartez/cartez.component';
// import { PaintComponent } from './paint/paint.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // { path: 'paint', component: PaintComponent }
    { path: 'paint', component: CartezComponent }
];
