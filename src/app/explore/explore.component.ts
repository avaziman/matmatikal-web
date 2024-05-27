import { Component, OnInit } from '@angular/core';
import { SketchService } from '../sketch.service';
import { MatCardModule } from '@angular/material/card';
import { Sketch } from '../../api_bindings/Sketch';
import { TimeAgoPipe } from 'time-ago-pipe';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  constructor(private sketchService: SketchService) { }
 
  sketches: Sketch[] = [];

  ngOnInit(): void {
    this.sketchService.explore().subscribe(r => {
      this.sketches = r;
    })
  }
}
