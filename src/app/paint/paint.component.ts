import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
const POINT_SIZE = 5;
const TEXT_PADDING = 5;
const TOGGLE_DIST = 10;

interface Point {
  letter: string,
  x: number,
  y: number
}

interface Connection {
  a: Point,
  b: Point
}

function makeLetterIterator() {
  let letter = 'A';

  const letterIterator = {
    next() {
      let result;
      result = { value: letter, done: false };
      letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      return result;
    },
  };
  return letterIterator;
}
@Component({
  selector: 'app-paint',
  standalone: true,
  imports: [],
  templateUrl: './paint.component.html',
  styleUrl: './paint.component.css'
})
export class PaintComponent implements AfterViewInit {
  @ViewChild('drawCanvas'/* , {static: true } */)
  canvas: ElementRef<HTMLCanvasElement> | undefined | null;

  context: CanvasRenderingContext2D | undefined | null;

  letterIt = makeLetterIterator();
  points: Point[] = [];
  connections: Connection[] = [];
  hovered?: Point;
  toggled?: Point;

  mouseDown: boolean = false;

  ngAfterViewInit(): void {
    if (this.canvas) {

      this.canvas.nativeElement.width = 400;
      this.canvas.nativeElement.height = 400;
      this.context = this.canvas.nativeElement.getContext('2d');
    }

    if (this.context) {
      this.context.fillStyle = "black";
    }
  }

  onMouseMove(e: MouseEvent) {
    if (!this.context) {
      return;
    }

    let x = e.offsetX;
    let y = e.offsetY;

    this.hovered = undefined;

    for (const point of this.points) {
      let dist = Math.sqrt((Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)))
      // const TOGGLE_PADDING = 2;
      // const RADIUS = POINT_SIZE + TOGGLE_PADDING;
      // console.log(dist)
      if (dist <= TOGGLE_DIST) {
        this.hovered = point;
        break;
      }
    }

    this.draw(x, y);
  }

  onMouseDown(e: MouseEvent) {

    if (e.button === 2) {
      this.toggled = undefined;
      this.draw(0, 0);
      return;
    }

    let point = {
      x: e.offsetX,
      y: e.offsetY,
      letter: this.letterIt.next().value
    };
    console.log(this.hovered);

    if (!this.context) {
      return;
    }

    if (this.hovered !== undefined) {
      // two points
      if (this.toggled !== undefined && this.hovered !== this.toggled) {
        this.connections.push({ a: this.toggled, b: this.hovered });
      }

      this.toggled = this.hovered;
      this.onMouseMove(e);

    } else {
      this.points.push(point);
      this.onMouseMove(e);
      this.onMouseDown(e);
    }

    this.draw(point.x, point.y);
  }

  draw(x: number, y: number) {
    if (!this.context) {
      return;
    }

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    if (this.hovered !== undefined) {
      this.drawPoint(this.hovered, POINT_SIZE + TEXT_PADDING, 'green');
      console.log("hovered: ", this.hovered);
    }

    if (this.toggled !== undefined) {
      this.drawPoint(this.toggled, POINT_SIZE + TEXT_PADDING, 'green');
      console.log("toggled: ", this.toggled);
    }

    for (let point of this.points) {
      this.drawPoint(point, POINT_SIZE, 'black');
    }

    for (let points of this.connections) {
      this.drawLine(points.a.x, points.a.y, points.b.x, points.b.y);
    }

    if (this.toggled !== undefined) {
      this.drawLine(x, y, this.toggled.x, this.toggled.y);
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    if (!this.context) {
      return;
    }

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  drawPoint(point: Point, radius: number, color: string) {
    if (!this.context) {
      return;
    }

    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.fillStyle = color;

    this.context.ellipse(point.x, point.y, radius, radius, 0, 0, 2 * Math.PI);
    this.context.fill();

    // this.context.lineWidth = 2;
    // this.context.lineTo(point.x, point.y);

    // this.context.fill();

    this.context.beginPath();
    this.context.textAlign = 'center';
    this.context.fillText(point.letter, point.x, point.y - (POINT_SIZE + TEXT_PADDING));
  }

}
