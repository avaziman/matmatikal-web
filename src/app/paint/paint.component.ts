import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
const POINT_SIZE = 5;
const TEXT_PADDING = 5;
const TOGGLE_DIST = 10;

interface Point {
  letter: string,
  x: number,
  y: number
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
  toggled?: number;
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

    let redraw = false;
    // can be optimized
    this.toggled = undefined;

    for (const [i, point] of this.points.entries()) {
      let dist = Math.sqrt((Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)))
      const TOGGLE_PADDING = 2;
      const RADIUS = POINT_SIZE + TOGGLE_PADDING;
      console.log(dist)
      if (dist <= TOGGLE_DIST) {


        redraw = true;
        this.toggled = i;
        break;
      }
    }

    // if (redraw) {
    this.draw();
    // }
  }

  onMouseDown(e: MouseEvent) {
    let point = {
      x: e.offsetX,
      y: e.offsetY,
      letter: this.letterIt.next().value
    };
    console.log(this.toggled);

    if (!this.context) {
      return;
    }



    // let last_point = this.points.pop();

    // if (last_point) {

    //   this.context.moveTo(last_point.x, last_point.y);

    //   this.context.lineTo(point.x, point.y);
    //   this.context.stroke();
    // }

    if (this.toggled) {

    } else {
      this.points.push(point);
    }
    this.draw();
  }

  draw() {
    if (this.context) {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    if (this.toggled) {
      this.drawPoint(this.points[this.toggled], POINT_SIZE + TEXT_PADDING, 'green');
    }
    console.log("toggled", this.toggled)
    for (let point of this.points) {
      this.drawPoint(point, POINT_SIZE, 'black');
    }
    

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

    this.context.lineWidth = 2;
    this.context.lineTo(point.x, point.y);

    this.context.fill();

    this.context.beginPath();
    this.context.textAlign = 'center';
    this.context.fillText(point.letter, point.x, point.y - (POINT_SIZE + TEXT_PADDING));
  }

}
