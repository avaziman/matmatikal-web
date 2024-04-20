import { Component, ElementRef, Input, ViewChild, AfterViewInit, HostListener, Output, EventEmitter } from '@angular/core';
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
  id: number;
  ranges?: Range[]
}

interface Range {
  from: number,
  to: number
}

export type Pos = PosT<number>;
// type Line = LinearFn<number>;

export interface Point {
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


  @Output() onCord = new EventEmitter<Pos>();

  @ViewChild('drawCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  points: Point[] = [];
  // hovered?: Point;
  // maybe separate axis
  scale: number = DEFAULT_SCALE;
  view_pos: Pos = { x: 0, y: 0 };

  vertical_lines: number[] = [];
  lines: LineFx[] = [];

  addPointCords(cords: Pos, letter: string) {
    // round for simplicity
    this.points.push({
      letter: letter,
      cords: { x: cords.x, y: cords.y }
    })

    if (this.points.length > 1) {
      const last_point = this.points[this.points.length - 2];
      const point = this.points[this.points.length - 1];
      const m = (point.cords.y - last_point.cords.y) / (point.cords.x - last_point.cords.x);

      this.addLine({
        id: this.lines.length,
        m: m, b: -m * point.cords.x + point.cords.y,
        ranges: [{ from: Math.min(point.cords.x, last_point.cords.x), to: Math.max(point.cords.x, last_point.cords.x) }]
      });
    }
    this.draw();

    // console.log(this.points);
  }

  addLine(line: LineFx) {
    this.lines.push(line);
  }

  addVerticalLine(x: number) {
    this.vertical_lines.push(x);
  }

  cordToPixelPos(pos: Pos): Pos {
    return {
      x: (pos.x - this.view_pos.x) * this.scale,
      y: this.height - (pos.y - this.view_pos.y) * this.scale,
    }
  }

  pixelPosToCord(pos: Pos): Pos {
    return {
      x: this.view_pos.x + (pos.x / this.width) * this.getRange().x,
      y: this.view_pos.y + ((this.height - pos.y) / this.height) * this.getRange().y,
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

  drawPoint(point: Point, radius: number, color: string) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.fillStyle = color;

    const ppos = this.cordToPixelPos(point.cords);

    this.context.ellipse(ppos.x, ppos.y, radius, radius, 0, 0, 2 * Math.PI);
    this.context.fill();

    this.context.lineWidth = 2;
    this.context.lineTo(ppos.x, ppos.y);

    this.context.fill();

    this.context.beginPath();
    this.context.textAlign = 'center';

    let txt = point.letter;
    // if (this.analytical) {
    //   // coordinates
    //   txt += `(${point.evaluated_pos.x}, ${point.evaluated_pos.y})`;
    // }
    const TEXT_PADDING = 5;
    this.context.fillText(txt, ppos.x, ppos.y - TEXT_PADDING * 2);
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

    this.context.fillStyle = "#eeeeee";
    this.context.fillRect(0, 0, this.width, this.height);

    let range = this.getRange();
    console.log({ w: this.width, h: this.height, s: this.scale, r: range });

    this.view_pos = { x: -range.x / 2, y: -range.y / 2 };

    this.draw();
  }

  ngOnInit() {
    this.lines = []
    this.addVerticalLine(0);
    this.addLine({ m: 0, b: 0, id: 0 });
    // this.addVerticalLine(1);
    // this.addVerticalLine(2);
    // this.addVerticalLine(-1);
    // this.addVerticalLine(-2);
  }

  drawTeeth() {
    const TEETH_PER_AXIS = 10;
    // size is constant in pixels, not in coordinates

    const SIZE = 5 /* px */ / this.scale;

    // round to one significant digit
    let range = this.getRange();
    let multipler = Math.pow(10, Math.floor(Math.log10(range.x)));
    let pos_multipler = Math.pow(10, 1 + Math.abs(Math.floor(Math.log10(range.x))));
    let spaces = (Math.floor(range.x / multipler) * multipler) / TEETH_PER_AXIS;
    let start = Math.ceil(this.view_pos.x / spaces);
    const total_teeth = range.x / spaces;
    // console.table({spaces, start ,multipler, range})

    for (let i = start; i < start + total_teeth; i++) {
      let x = Math.round(i * spaces * pos_multipler) / pos_multipler;
      if (x === 0) continue;
      // start +=
      this.drawLine({ x, y: -SIZE }
        , { x, y: SIZE }
      );

      this.context.textAlign = 'center';

      let pixelPos = this.cordToPixelPos({ x, y: SIZE });
      this.context.fillText(this.shortNum(x), pixelPos.x - 5, pixelPos.y + 30);
    }
    start = Math.ceil(this.view_pos.y / spaces);
    for (let i = start; i < start + total_teeth; i++) {
      let y = Math.round(i * spaces * pos_multipler) / pos_multipler;
      if (y === 0) continue;
      this.drawLine({ x: -SIZE, y }
        , { x: SIZE, y }
      );
      let pixelPos = this.cordToPixelPos({ x: SIZE, y });
      this.context.fillText(this.shortNum(y), pixelPos.x + 10, pixelPos.y + 5);
    }
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height);

    for (const vl of this.vertical_lines) {
      this.drawVerticalLine(vl);
    }

    for (const l of this.lines) {
      if (l.ranges) {
        for (const range of l.ranges) {
          let p1 = this.lineFx(l, range.from);
          let p2 = this.lineFx(l, range.to);

          this.drawLine(p1, p2);
        }
      } else {
        let p1 = this.lineFx(l, this.view_pos.x);
        let p2 = this.lineFx(l, this.view_pos.x + this.getRange().x);
        this.drawLine(p1, p2);
      }
    }

    for (const p of this.points) {
      const POINT_SIZE = 5;

      this.drawPoint(p, POINT_SIZE, 'black');
    }

    this.context.fillStyle = "black";

    this.drawTeeth();

    this.drawFunction();
  }

  drawFunction() {
    this.context.beginPath();
    const MAX_Y = this.view_pos.y + this.getRange().y;
    const MIN_Y = this.view_pos.y;
    let out_of_range = null;
    for (let i = 0; i < this.width; i += 1) {
      const x = this.pixelPosToCord({ x: i, y: 0 }).x;
      let y = x ** 2;

      let oor = null;
      if (y > MAX_Y) {
        y = MAX_Y;
        oor = MAX_Y;
      } else if (y < MIN_Y) {
        y = MIN_Y;
        oor = MIN_Y;
      }

      const ppos = this.cordToPixelPos({ x, y });

      if (out_of_range) {
        if (oor === out_of_range) {
          // not connected, starts new seq
          this.context.moveTo(ppos.x, ppos.y)

          continue;
        }
      }
      out_of_range = oor;
      this.context.lineTo(ppos.x, ppos.y);
      this.context.moveTo(ppos.x, ppos.y);
    }
    this.context.closePath();

    this.context.stroke();
  }

  shortNum(n: number): string {
    let res = n.toString();

    // let scientific = n.toExponential();
    // if (res.length > scientific.length) {
    //   return scientific;
    // }

    return res;
  }

  lineFx(line: LineFx, x: number): Pos {
    return { x, y: line.m * x + line.b };
  }


  onWheel(e: WheelEvent) {
    e.preventDefault();
    // console.log(e)

    const pointingPos = this.pixelPosToCord({ x: e.offsetX, y: e.offsetY });
    let mouseDy = e.deltaY;
    const sign = Math.sign(mouseDy);
    const range = this.getRange();
    let dx = (pointingPos.x - this.view_pos.x) / range.x;
    let dy = (pointingPos.y - this.view_pos.y) / range.y;

    const factor = 0.05;
    if (sign === -1) {
      this.scale *= 1 + factor;
    } else {
      this.scale *= 1 - factor;
    }
    const new_range = this.getRange();

    this.view_pos.x = pointingPos.x - new_range.x * dx;
    this.view_pos.y = pointingPos.y - new_range.y * dy;
    console.table({ view: this.view_pos, scale: this.scale, range: this.getRange() })

    this.draw();
  }

  onMouseMove(e: MouseEvent) {
    let ppos = { x: e.offsetX, y: e.offsetY };
    let cords = this.pixelPosToCord(ppos);
    this.onCord.emit(cords);

    for (const point of this.points) {
      // if (this.toggled && this.toggled.p === point) { continue; }


      const TOGGLE_DIST_PX = 10;
      if (this.distWithin(cords, point.cords, TOGGLE_DIST_PX / this.scale)) {
        // this.hovered = point;
        // console.log("HOVERED", point)
        break;
      }
    }


    if (~e.buttons & 1) {
      return;
    }
    const mul = -1 / this.scale;

    let dx = e.movementX;
    let dy = e.movementY;
    this.view_pos.x += mul * dx;
    this.view_pos.y -= mul * dy;
    this.draw();

  }

  distWithin(p1: Pos, p2: Pos, d: number): boolean {
    let dx = Math.abs(p1.x - p2.x);
    if (dx > d) return false;
    let dy = Math.abs(p1.y - p2.y);
    if (dy > d) return false;

    let dist = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
    if (dist > d) return false;

    return true;
  }

}
