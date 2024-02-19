// import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MathNode, simplify, parse, ConstantNode } from 'mathjs';

// import { NgFor } from '@angular/common';
// import { LineT } from '../logic/line';

// const POINT_SIZE = 5;
// const TEXT_PADDING = 5;
// const TOGGLE_DIST = 10;
// const ORIGIN_PADDING = 10;

// interface PosG<T> {
//   x: T,
//   y: T
// }

// type Pos = PosG<number>;

// interface Point {
//   letter: string,
//   pixel_pos: Pos,
//   evaluated_pos: Pos,
//   theoretical_pos: PosG<MathNode>
// }


// interface Connection {
//   a: Point,
//   b: Point,
//   equation: LineT
// }

// function makeLetterIterator() {
//   let letter = 'A';

//   const letterIterator = {
//     next() {
//       let result;
//       result = { value: letter, done: false };
//       letter = String.fromCharCode(letter.charCodeAt(0) + 1);
//       return result;
//     },
//   };
//   return letterIterator;
// }

// interface PointRef {
//   p: Point,
//   index: number,
// }

// @Component({
//   selector: 'app-paint',
//   standalone: true,
//   imports: [MatInputModule, MatButtonModule, MatButtonToggleModule, NgFor],
//   templateUrl: './paint.component.html',
//   styleUrl: './paint.component.css'
// })
// export class PaintComponent implements AfterViewInit {

//   @ViewChild('command', { static: true })
//   command: ElementRef<HTMLInputElement> | undefined | null;


//   @ViewChild('geometryType', { static: true })
//   geometryType: ElementRef<MatButtonToggleGroup> | undefined | null;

//   context: CanvasRenderingContext2D | undefined | null;

//   letterIt = makeLetterIterator();
//   points: Point[] = [];
//   connections: Connection[] = [];
//   lines: string[] = [];
//   hovered?: Point;
//   toggled?: PointRef;
//   analytical: boolean = false;
//   mouseDown = false;

//   ngAfterViewInit(): void {
//     // if (this.canvas) {

//     //   this.canvas.nativeElement.width = 400;
//     //   this.canvas.nativeElement.height = 400;
//     //   this.context = this.canvas.nativeElement.getContext('2d');
//     // }

//     if (!this.context || !this.geometryType) {
//       return;
//     }

//     // this.analytical = (this.geometryType.nativeElement.selected as MatButtonToggle).value === 'analytical';
//     // this.context..pixelPointPos({ x: 0, y: 0 });
//     // this.addPoint(pos, '');

//     // // origin lines
//     // this.addPoint(this.pixelPointPos({ x: 0, y: this.context.canvas.height }), '');
//     // this.addPoint(this.pixelPointPos({ x: this.context.canvas.width, y: 0 }), '');

//     // this.addConnection(this.points[0], this.points[1]);
//     // this.addConnection(this.points[0], this.points[2]);
//     this.draw({ x: 0, y: 0 });
//   }


//   newPoint(ppos: Pos, letter: string): Point {
//     let evaluated_pos = this.realPointPos(ppos);
//     let theoretical_pos = { x: new ConstantNode(evaluated_pos.x), y: new ConstantNode(evaluated_pos.y) }
//     return { pixel_pos: ppos, evaluated_pos, theoretical_pos, letter: letter };
//   }

//   addPoint(ppos: Pos, letter: string) {
//     this.points.push(this.newPoint(ppos, letter))
//   }

//   newConnection(a: Point, b: Point): Connection {
//     let m = simplify('(x1 - x2) / (y1 - y2)', { x1: a.theoretical_pos.x, x2: b.theoretical_pos.x, y1: a.theoretical_pos.y, y2: b.theoretical_pos.y });

//     let func;
//     if (Math.abs(m.evaluate()) == Infinity)  {
//       // vertical line
//       func = { x: a.theoretical_pos.x };
//     } else {
//       // y - y1 = m(x - x1) => y = mx -mx1 + y1
//       let b = simplify('-m * X + Y', { m, X: a.theoretical_pos.x, Y: a.theoretical_pos.y });
//       let equation = simplify('m * x + b', { m, b });
//       console.log("b", b.toString())
//       console.log("equation", equation.toString())

//       func = {
//         equation,
//         m: m,
//         b: b,
//       };
//     }
    

//     return {
//       a: a, b: b,
//       equation: func
//     };
//   }

//   addConnection(a: Point, b: Point) {
//     // if (this.lines. a.letter )
//     this.connections.push(this.newConnection(a, b));

//     this.lines = this.connections.map(c => c.a.letter + c.b.letter);
//     // for (const c of this.connections){ 
//     //   console.log("LINE", c.a.letter + c.b.letter)
//     // }
//     // console.log("lines:", )
//   }

//   onCommand() {
//     console.log(this.command)
//     console.log("Got command", this.command?.nativeElement.value)
//   }

//   distWithin(p1: Pos, p2: Pos, d: number): boolean {
//     let dx = Math.abs(p1.x - p2.x);
//     if (dx > TOGGLE_DIST) return false;
//     let dy = Math.abs(p1.y - p2.y);
//     if (dy > TOGGLE_DIST) return false;

//     let dist = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
//     if (dist > d) return false;

//     return true;
//   }

//   onMouseMove(e: MouseEvent) {
//     if (!this.context) {
//       return;
//     }
//     // console.log("mousedown", this.mouseDown);

//     let x = e.offsetX;
//     let y = e.offsetY;
//     let mousePos = { x, y };

//     this.hovered = undefined;

//     for (const point of this.points) {
//       if (this.toggled && this.toggled.p === point) { continue; }

//       if (this.distWithin(mousePos, point.pixel_pos, TOGGLE_DIST)) {
//         this.hovered = point;
//         break;
//       }
//     }

//     // y - y1 = -m(x - x1) => y = -mx + mx1 + y1

//     // find dist
//     // -mx + mx1 + y1 = mx + b
//     // 2mx + b = mx1 + y1
//     // x = (mx1 + y1 - b) / 2m

//     // point on line, no mathematical importance
//     for (const connection of this.connections) {
//       // perpendicular

//       if ("m" in connection.equation) {
//         let perpX = simplify("(m * x + y - b) / 2m", { x, y, m: connection.equation.m, b: connection.equation.b }).evaluate();
//         console.log("X", perpX.toString())

//         let perpY = connection.equation.equation.evaluate({ x: perpX });
//         console.log("Y", perpY.toString())
//         console.log("MOUSEPOS", mousePos)

//         let pos = { x: perpX, y: perpY };

//         if (this.distWithin(pos, this.realPointPos(mousePos), TOGGLE_DIST * 2)) {
//           this.hovered = {
//             pixel_pos: this.pixelPointPos(pos),
//             evaluated_pos: pos,
//             theoretical_pos: { x: new ConstantNode(0), y: new ConstantNode(0) },
//             letter: this.letterIt.next().value
//           };
//           console.log("OVER")
//         }
//       }
//     }

//     if (this.mouseDown) {
//       if (this.toggled) {
//         // point moved
//         this.changePos(this.toggled.p, { x: x, y: y });

//         for (let i = 0; i < this.connections.length; i++) {
//           let c = this.connections[i];
//           if (c.a === this.toggled.p || c.b === this.toggled.p) {
//             this.connections[i] = this.newConnection(c.a, c.b);
//           }
//         }
//       }
//     }

//     this.draw({ x: x, y: y });
//   }

//   onMouseUp(_e: MouseEvent) {
//     if (this.toggled && this.hovered && this.toggled.p != this.hovered) {
//       // merge - change toggled to hovered
//       let del = [];
//       for (let i = 0; i < this.connections.length; i++) {
//         let c = this.connections[i];

//         if (c.a === this.toggled.p) {
//           c.a = this.hovered;
//         } else if (c.b === this.toggled.p) {
//           c.b = this.hovered;
//         }

//         if (c.a === c.b) {
//           del.push(i);
//         }
//       }

//       for (let i of del) {
//         this.connections.splice(i, 1);
//       }

//       this.points.splice(this.toggled.index, 1);
//       this.toggled = undefined;
//     }
//     this.mouseDown = false;
//   }

//   onMouseDown(e: MouseEvent) {

//     if (e.button === 2) {
//       this.toggled = undefined;
//       this.draw({ x: 0, y: 0 });
//       return;
//     }

//     let ppos = { x: e.offsetX, y: e.offsetY };
//     let evaluated_pos = this.realPointPos(ppos);

//     let point = {
//       pixel_pos: ppos,
//       evaluated_pos: evaluated_pos,
//       theoretical_pos: { x: new ConstantNode(evaluated_pos.x), y: new ConstantNode(evaluated_pos.y) },
//       letter: this.letterIt.next().value
//     };
//     console.log(this.hovered);

//     if (!this.context) {
//       return;
//     }

//     if (this.hovered !== undefined) {
//       // two points
//       if (this.toggled !== undefined && this.hovered !== this.toggled.p) {
//         this.addConnection(this.toggled.p, this.hovered);
//       }

//       this.toggled = { p: this.hovered, index: this.points.indexOf(this.hovered) };
//       this.onMouseMove(e);

//     } else {
//       this.points.push(point);
//       this.onMouseMove(e);
//       this.onMouseDown(e);
//     }

//     this.draw(point.pixel_pos);
//     this.mouseDown = true;
//   }

//   draw(pos: Pos) {
//     if (!this.context) {
//       return;
//     }

//     this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

//     if (this.hovered !== undefined) {
//       this.drawPoint(this.hovered, POINT_SIZE + TEXT_PADDING, 'green');
//       // console.log("hovered: ", this.hovered);
//     }

//     if (this.toggled !== undefined) {
//       this.drawPoint(this.toggled.p, POINT_SIZE + TEXT_PADDING, 'green');
//       // console.log("toggled: ", this.toggled.p);
//     }

//     for (let point of this.points) {
//       this.drawPoint(point, POINT_SIZE, 'black');
//     }

//     for (let connection of this.connections) {
//       this.drawConnection(connection);
//     }

//     if (this.toggled !== undefined) {
//       this.drawLine(this.toggled.p, pos);
//     }
//   }

//   drawConnection(c: Connection) {
//     if (!this.context) {
//       return;
//     }

//     if (this.analytical) {
//       let text = '';
//       // if (c.equation instanceof LinearFunc) {
//       //   text = `y = ${c.equation.m}x + ${}`;
//       // }
//       // this.context.fillText("f(x) = " + c.fx.toString(), (c.a.pixel_pos.x + c.b.pixel_pos.x) / 2, (c.a.pixel_pos.y + c.b.pixel_pos.y) / 2);
//     }

//     this.drawLine(c.a, c.b.pixel_pos);
//   }





//   realPointPos(ppos: Pos): Pos {

//     if (!this.context) {
//       return { x: 0, y: 0 };
//     }

//     return {
//       x: ppos.x - ORIGIN_PADDING,
//       y: this.context.canvas.height - ppos.y - ORIGIN_PADDING
//     }
//   }

//   pixelPointPos(ppos: Pos): Pos {

//     if (!this.context) {
//       return { x: 0, y: 0 };
//     }

//     return { x: ppos.x + ORIGIN_PADDING, y: this.context.canvas.height - ppos.y - ORIGIN_PADDING }
//   }

//   changePos(p: Point, ppos: Pos) {
//     p.pixel_pos = ppos;
//     p.evaluated_pos = this.realPointPos(ppos);
//   }

//   geometryTypeChange(change: MatButtonToggleChange) {
//     this.analytical = change.value === 'analytical';
//     this.draw({ x: 0, y: 0 });
//   }
// }
