import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartezComponent } from './cartez/cartez.component';
import { SketcherComponent } from './sketcher/sketcher.component';
// import { PaintComponent } from './paint/paint.component';

export const routes: Routes = [
    { path: '', redirectTo: 'sketch' , pathMatch: 'prefix'},
    { path: 'login', component: LoginComponent },
    // { path: 'paint', component: PaintComponent }
    { path: 'sketch', component: SketcherComponent },
];
