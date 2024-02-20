import { Component, ElementRef, Input, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Line } from '../logic/line';
import math from 'mathjs';

const DEFAULT_SCALE = 10;

interface PosT<T> {
  x: T,
  y: T
}

// y = mx + b
export interface LineFx {
  m: number;
  b: number;
}

type Pos = PosT<number>;
// type Line = LinearFn<number>;

interface Point {
  letter: string,
  cords: Pos,
}

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

  points: Point[] = [];
  // maybe separate axis
  scale: number = DEFAULT_SCALE;
  view_pos: Pos = { x: 0, y: 0 };

  vertical_lines: number[] = [];
  lines: LineFx[] = [];

  addLine(line: LineFx) {
    this.lines.push(line);
  }

  addVerticalLine(x: number) {
    this.vertical_lines.push(x);
  }

  cordToPixelPos(pos: Pos): Pos {
    return {
      x: (pos.x - this.view_pos.x) * this.scale,
      y: (pos.y - this.view_pos.y) * this.scale,
    }
  }

  drawVerticalLine(x: number) {
    this.drawLine({ x, y: this.view_pos.y }, { x, y: this.view_pos.y + this.getRange().y });
  }

  drawLine(p1: Pos, p2: Pos) {
    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';

    let pc1 = this.cordToPixelPos(p1);
    let pc2 = this.cordToPixelPos(p2);

    this.context.moveTo(pc1.x, pc1.y);
    this.context.lineTo(pc2.x, pc2.y);
    this.context.stroke();
  }

  // drawPoint(point: Point, radius: number, color: string) {
  //   this.context.beginPath();
  //   this.context.strokeStyle = color;
  //   this.context.fillStyle = color;

  //   this.context.ellipse(point.pixel_pos.x, point.pixel_pos.y, radius, radius, 0, 0, 2 * Math.PI);
  //   this.context.fill();

  //   this.context.lineWidth = 2;
  //   this.context.lineTo(point.pixel_pos.x, point.pixel_pos.y);

  //   this.context.fill();

  //   this.context.beginPath();
  //   this.context.textAlign = 'center';

  //   let txt = point.letter;
  //   if (this.analytical) {
  //     // coordinates
  //     txt += `(${point.evaluated_pos.x}, ${point.evaluated_pos.y})`;
  //   }
  //   this.context.fillText(txt, point.pixel_pos.x, point.pixel_pos.y - TEXT_PADDING * 2);
  // }


  onMouseMove(e: MouseEvent) {
    // this.height.
    // this.height
  }
  onMouseUp(e: MouseEvent) {
  }
  onMouseDown(e: MouseEvent) {
  }

  getRange(): Pos {
    return { x: this.width / this.scale, y: this.height / this.scale };
  }

  ngAfterViewInit() {
    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 500;

    this.width = this.canvas.nativeElement.width;
    this.height = this.canvas.nativeElement.height;

    let ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      this.context = ctx;
    }
    let range = this.getRange();
    console.log({ w: this.width, h: this.height, s: this.scale, r: range });

    this.context.fillStyle = "#eeeeee";
    this.context.fillRect(0, 0, this.width, this.height);

    this.view_pos = { x: -range.x / 2, y: -range.y / 2 };

    this.addVerticalLine(0);
    this.addLine({ m: 0, b: 0 });
    // this.addVerticalLine(1);
    // this.addVerticalLine(2);
    // this.addVerticalLine(-1);
    // this.addVerticalLine(-2);
    this.draw();

  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height);

    for (const vl of this.vertical_lines) {
      this.drawVerticalLine(vl);
    }

    for (const l of this.lines) {
      let p1 = this.lineFx(l, this.view_pos.x);
      let p2 = this.lineFx(l, this.view_pos.x + this.getRange().x);

      this.drawLine(p1, p2);
    }

    const TEETH_PER_AXIS = 10;
    // size is constant in pixels, not in coordinates
    
    const SIZE = 10 /* px */ / this.scale;

    // round to the nearest multiple of TEETH
    // 11.23 -> 10
    // 2.3437 
    // let roundRange = this.range.x;
    let range = this.getRange();
    let spaces = (range.x / TEETH_PER_AXIS);
    let start = Math.ceil(this.view_pos.x / spaces);
    this.context.fillStyle = "black";

    for (let i = start; i < start + TEETH_PER_AXIS; i++) {
      let x = i * spaces;
      this.drawLine({ x, y: -SIZE }
        , { x, y: SIZE }
      );
      
      let pixelPos = this.cordToPixelPos({ x, y: SIZE });
      this.context.fillText(x.toString(), pixelPos.x, pixelPos.y + 20);
    }
    start = Math.ceil(this.view_pos.y / spaces);
    for (let i = start; i < start + TEETH_PER_AXIS; i++) {
      let y = i * spaces;
      this.drawLine({ x: -SIZE, y }
        , { x: SIZE, y }
      );
      let pixelPos = this.cordToPixelPos({ x: SIZE, y});
      this.context.fillText(y.toString(), pixelPos.x, pixelPos.y + 20);
    }
  }

  lineFx(line: LineFx, x: number): Pos {
    return { x, y: line.m * x + line.b };
  }

  @HostListener('window:wheel', ['$event']) // for window scroll events
  onWheel(e: WheelEvent) {
    // console.log(e)
    let mouseDy = e.deltaY;
    const sign = Math.sign(mouseDy);
    const mul = sign * 0.5;

    let dx = this.width / 2 - e.offsetX;
    let dy = this.height / 2 - e.offsetY;
    let last_scale = this.scale;

    this.scale -= sign * 2;

    this.view_pos.x *= last_scale / this.scale;
    this.view_pos.y *= last_scale / this.scale;
    this.view_pos.x += mul * dx / this.width;
    this.view_pos.y += mul * dy / this.height;
    console.table({ view: this.view_pos, scale: this.scale, range: this.getRange() })

    this.draw();
  }
}
