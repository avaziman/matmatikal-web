import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';

import { MathNode, simplify } from 'mathjs';

const POINT_SIZE = 5;
const TEXT_PADDING = 5;
const TOGGLE_DIST = 10;
const ORIGIN_PADDING = 10;

interface Pos {
  x: number,
  y: number
}

interface Point {
  letter: string,
  // pixel position
  ppos: Pos,
  // real position
  rpos: Pos
}

interface Connection {
  a: Point,
  b: Point,
  fx: MathNode
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

interface PointRef {
  p: Point,
  index: number,
}

@Component({
  selector: 'app-paint',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatButtonToggleModule],
  templateUrl: './paint.component.html',
  styleUrl: './paint.component.css'
})
export class PaintComponent implements AfterViewInit {
  @ViewChild('drawCanvas'/* , {static: true } */)
  canvas: ElementRef<HTMLCanvasElement> | undefined | null;

  @ViewChild('command'/* , {static: true } */)
  command: ElementRef<HTMLInputElement> | undefined | null;


  @ViewChild('geometryType'/* , {static: true } */)
  geometryType: ElementRef<MatButtonToggleGroup> | undefined | null;

  context: CanvasRenderingContext2D | undefined | null;

  letterIt = makeLetterIterator();
  points: Point[] = [];
  connections: Connection[] = [];
  hovered?: Point;
  toggled?: PointRef;
  analytical: boolean = false;

  mouseDown: boolean = false;

  ngAfterViewInit(): void {
    if (this.canvas) {

      this.canvas.nativeElement.width = 400;
      this.canvas.nativeElement.height = 400;
      this.context = this.canvas.nativeElement.getContext('2d');
    }

    if (!this.context || !this.geometryType) {
      return;
    }

    // this.analytical = (this.geometryType.nativeElement.selected as MatButtonToggle).value === 'analytical';
    this.context.fillStyle = "black";
    // origin point
    // let pos = this.pixelPointPos({ x: 0, y: 0 });
    // this.addPoint(pos, '');

    // // origin lines
    // this.addPoint(this.pixelPointPos({ x: 0, y: this.context.canvas.height }), '');
    // this.addPoint(this.pixelPointPos({ x: this.context.canvas.width, y: 0 }), '');

    // this.addConnection(this.points[0], this.points[1]);
    // this.addConnection(this.points[0], this.points[2]);
    this.draw({ x: 0, y: 0 });
  }


  newPoint(ppos: Pos, letter: string): Point {
    return { ppos: ppos, rpos: this.realPointPos(ppos), letter: letter };
  }

  addPoint(ppos: Pos, letter: string) {
    this.points.push(this.newPoint(ppos, letter))
  }

  newConnection(a: Point, b: Point): Connection {
    let m = (a.rpos.y - b.rpos.y) / (a.rpos.x - b.rpos.x);
    let func = simplify(' m*x - m*y + z', { m: m, y: a.rpos.x, z: a.rpos.y }, { exactFractions: false });
    return { a: a, b: b, fx: func };
  }

  addConnection(a: Point, b: Point) {
    this.connections.push(this.newConnection(a, b));

    for (const c of this.connections){ 
      console.log("LINE", c.a.letter + c.b.letter)
    }
    // console.log("lines:", )
  }

  onCommand() {
    console.log(this.command)
    console.log("Got command", this.command?.nativeElement.value)
  }

  onMouseMove(e: MouseEvent) {
    if (!this.context) {
      return;
    }
    // console.log("mousedown", this.mouseDown);

    let x = e.offsetX;
    let y = e.offsetY;

    this.hovered = undefined;

    for (const point of this.points) {
      let dist = Math.sqrt((Math.pow(point.ppos.x - x, 2) + Math.pow(point.ppos.y - y, 2)));
      if (dist <= TOGGLE_DIST) {
        this.hovered = point;
        break;
      }
    }

    if (this.mouseDown) {
      if (this.toggled) {
        // point moved
        this.changePos(this.toggled.p, { x: x, y: y });

        for (let i = 0; i < this.connections.length; i++) {
          let c = this.connections[i];
          if (c.a === this.toggled.p || c.b === this.toggled.p) {
            this.connections[i] = this.newConnection(c.a, c.b);
          }
        }
      }
    }

    this.draw({ x: x, y: y });
  }

  onMouseUp(_e: MouseEvent) {
    this.mouseDown = false;
  }

  onMouseDown(e: MouseEvent) {

    if (e.button === 2) {
      this.toggled = undefined;
      this.draw({ x: 0, y: 0 });
      return;
    }

    let ppos = { x: e.offsetX, y: e.offsetY };
    let point = {
      ppos: ppos,
      rpos: this.realPointPos(ppos),
      letter: this.letterIt.next().value
    };
    console.log(this.hovered);

    if (!this.context) {
      return;
    }

    if (this.hovered !== undefined) {
      // two points
      if (this.toggled !== undefined && this.hovered !== this.toggled.p) {
        this.addConnection(this.hovered, this.toggled.p);
      }

      this.toggled = { p: this.hovered, index: this.points.length - 1 };
      this.onMouseMove(e);

    } else {
      this.points.push(point);
      this.onMouseMove(e);
      this.onMouseDown(e);
    }

    this.draw(point.ppos);
    this.mouseDown = true;
  }

  draw(pos: Pos) {
    if (!this.context) {
      return;
    }

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    if (this.hovered !== undefined) {
      this.drawPoint(this.hovered, POINT_SIZE + TEXT_PADDING, 'green');
      // console.log("hovered: ", this.hovered);
    }

    if (this.toggled !== undefined) {
      this.drawPoint(this.toggled.p, POINT_SIZE + TEXT_PADDING, 'green');
      // console.log("toggled: ", this.toggled.p);
    }

    for (let point of this.points) {
      this.drawPoint(point, POINT_SIZE, 'black');
    }

    for (let connection of this.connections) {
      this.drawConnection(connection);
    }

    if (this.toggled !== undefined) {
      this.drawLine(this.toggled.p, pos);
    }
  }

  drawConnection(c: Connection) {
    if (!this.context) {
      return;
    }

    if (this.analytical) {
      this.context.fillText("f(x) = " + c.fx.toString(), (c.a.ppos.x + c.b.ppos.x) / 2, (c.a.ppos.y + c.b.ppos.y) / 2);
    }

    this.drawLine(c.a, c.b.ppos);
  }

  drawLine(p1: Point, p2: Pos) {
    if (!this.context) {
      return;
    }

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';

    this.context.moveTo(p1.ppos.x, p1.ppos.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.stroke();
  }

  drawPoint(point: Point, radius: number, color: string) {
    if (!this.context) {
      return;
    }

    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.fillStyle = color;

    this.context.ellipse(point.ppos.x, point.ppos.y, radius, radius, 0, 0, 2 * Math.PI);
    this.context.fill();

    this.context.lineWidth = 2;
    this.context.lineTo(point.ppos.x, point.ppos.y);

    this.context.fill();

    this.context.beginPath();
    this.context.textAlign = 'center';

    let txt = point.letter;
    if (this.analytical) {
      // coordinates
      txt += `(${point.rpos.x}, ${point.rpos.y})`;
    }
    this.context.fillText(txt, point.ppos.x, point.ppos.y - TEXT_PADDING * 2);
  }

  realPointPos(ppos: Pos): Pos {

    if (!this.context) {
      return { x: 0, y: 0 };
    }

    return { x: ppos.x - ORIGIN_PADDING, y: this.context.canvas.height - ppos.y - ORIGIN_PADDING }
  }

  pixelPointPos(ppos: Pos): Pos {

    if (!this.context) {
      return { x: 0, y: 0 };
    }

    return { x: ppos.x + ORIGIN_PADDING, y: this.context.canvas.height - ppos.y - ORIGIN_PADDING }
  }

  changePos(p: Point, ppos: Pos) {
    p.ppos = ppos;
    p.rpos = this.realPointPos(ppos);
  }

  geometryTypeChange(change: MatButtonToggleChange) {
    this.analytical = change.value === 'analytical';
    this.draw({x: 0, y: 0});
  }
}
