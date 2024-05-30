import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class ExploreComponent implements OnInit, AfterViewInit {
  constructor(private sketchService: SketchService, private router: Router) { }

  sketches: Sketch[] = [];
  username!: string;

  ngOnInit(): void {
    this.refreshSketches();
  }

  refreshSketches() {
    this.sketchService.explore().subscribe({
      next: r => {
        this.sketches = r;
      },
      error: e => {
        console.log(e.status)
      }
    })

  }

  ngAfterViewInit(): void {
    this.username = window.localStorage.getItem('username') as string;
    console.log('username', this.username)
  }

  openSketch(sketch: Sketch) {
    this.router.navigate(['/sketch'], { 
      queryParams: { sketch: JSON.stringify(sketch) }
    })
  }
  deleteSketch(sketch: Sketch) {
    const id = sketch.id;
    this.sketchService.delete(id).subscribe({
      next: r => {
        // this.sketches = r;
        this.refreshSketches()
      },
      error: e => {
        console.log(e.status)
      }
    })

  }
}
