import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cartez',
  standalone: true,
  imports: [],
  templateUrl: './cartez.component.html',
  styleUrl: './cartez.component.css'
})
export class CartezComponent {
  width!: number;
  height!: number;
  

  @ViewChild('drawCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  context!: CanvasRenderingContext2D;

  onMouseMove(e: MouseEvent) {
    // this.height.
    // this.height
  }
  onMouseUp(e: MouseEvent) {
  }
  onMouseDown(e: MouseEvent) {
  }

  ngAfterViewInit() {
    this.canvas.nativeElement.width =  300;
    this.canvas.nativeElement.height = 300;

    this.width = this.canvas.nativeElement.width;
    this.height = this.canvas.nativeElement.height;
    let ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) { 
      this.context = ctx;
    }
    console.log({ w: this.width, h: this.height });

    this.context.fillStyle = "#eeeeee";
    this.context.fillRect(0, 0, this.width, this.height);
  }
}
