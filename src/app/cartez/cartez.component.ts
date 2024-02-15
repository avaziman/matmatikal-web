import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cartez',
  standalone: true,
  imports: [],
  templateUrl: './cartez.component.html',
  styleUrl: './cartez.component.css'
})
export class CartezComponent {
  @Input() width: BehaviorSubject<number>;
  @Input() height: BehaviorSubject<number>;
  

  @ViewChild('drawCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement> | undefined | null;
  
  onMouseMove(e: MouseEvent) {
    // this.height.
    // this.height
  }
  onMouseUp(e: MouseEvent) {
  }
  onMouseDown(e: MouseEvent) {
  }

  constructor(width: BehaviorSubject<number>, height: BehaviorSubject<number>) {
    this.width = width;
    this.height = height;
  }
}
