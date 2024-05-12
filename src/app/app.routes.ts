import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartezComponent } from './cartez/cartez.component';
import { SketcherComponent } from './sketcher/sketcher.component';
import { HomeComponent } from './home/home.component';
// import { PaintComponent } from './paint/paint.component';

export const routes: Routes = [
    { path: 'home', redirectTo: '', pathMatch: 'prefix' },
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    // { path: 'paint', component: PaintComponent }
    { path: 'sketch', component: SketcherComponent },
];
