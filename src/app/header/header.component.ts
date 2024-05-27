import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeServiceService } from '../theme-service.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatSidenavModule, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public theme: ThemeServiceService) { }
  

   items =
     [
       { path: 'login', text: "Login", icon: "login" },
       { path: 'sketch', text: "Sketch", icon: "architecture" },
       { path: 'explore', text: "Explore", icon: "explore" }
     ]
}
