import { Component, OnInit } from '@angular/core';
import { SketchService } from '../sketch.service';
import { MatCardModule } from '@angular/material/card';
import { Sketch } from '../../api_bindings/Sketch';
import { IntlRelativeTimePipe } from 'angular-ecmascript-intl';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [MatCardModule, IntlRelativeTimePipe],
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
