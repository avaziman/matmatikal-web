import { Component, OnInit } from '@angular/core';
import { SketchService } from '../sketch.service';
import { MatCardModule } from '@angular/material/card';
import { Sketch } from '../../api_bindings/Sketch';
import { IntlRelativeTimePipe } from 'angular-ecmascript-intl';
import { MatButtonModule } from '@angular/material/button';
import { CartezComponent } from '../cartez/cartez.component';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [MatCardModule, IntlRelativeTimePipe, MatButtonModule, CartezComponent, MatDividerModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  constructor(private sketchService: SketchService, private router: Router ) { }
  
  sketches: Sketch[] = [];
  
  openSketch(sketch: Sketch) {
    this.router.navigate(['/sketch'], {
      queryParams: { sketch: JSON.stringify(sketch) }
    })
  }
  ngOnInit(): void {
    this.sketchService.explore().subscribe(r => {
      this.sketches = r;
    })
  }
}
