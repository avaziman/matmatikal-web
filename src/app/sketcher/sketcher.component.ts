import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartezComponent, Point, Pos } from '../cartez/cartez.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';


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
  selector: 'app-sketcher',
  standalone: true,
  imports: [CartezComponent, MatCardModule, CommonModule],
  templateUrl: './sketcher.component.html',
  styleUrl: './sketcher.component.css'
})
  
// interface Connection {
//   a: Point,
//   b: Point,
//   equation: LineT
// }
export class SketcherComponent {
  letterIt = makeLetterIterator();
    // connections: Connection[] = [];
  lines: string[] = [];
  hovered?: Point;
  toggled?: Point;
  analytical: boolean = false;
  mouseDown = false;
  
  @ViewChild(CartezComponent, { static: true })
  cartez!: CartezComponent;
  public myMath = Math;

  onMouseDown(e: MouseEvent) {

    if (e.button !== 2) {
      // this.toggled = undefined;
      return;
    }

    // if (this.hovered !== undefined) {
    //   // two points
    //   if (this.toggled !== undefined && this.hovered !== this.toggled) {
    //     // this.cartez.addLine(this.toggled.p, this.hovered);
    //   }

    //   // this.toggled = { p: this.hovered, index: this.points.indexOf(this.hovered) };
    //   this.onMouseMove(e);
    // } else {
      // this.points.push(point);
      let x = e.offsetX;
      let y = e.offsetY;
      let mousePos = { x, y };
      let letter = this.letterIt.next().value;
      this.cartez.addPointPx(mousePos,letter);
    //   this.hovered = letter;
    //   this.onMouseMove(e);
    //   this.onMouseDown(e);
    // }
  }

  onMouseUp(_e: MouseEvent) {
    if (this.toggled && this.hovered && this.toggled != this.hovered) {
      // merge - change toggled to hovered
      let del = [];
      //   for (let i = 0; i < this.connections.length; i++) {
      //     let c = this.connections[i];

      //     if (c.a === this.toggled.p) {
      //       c.a = this.hovered;
      //     } else if (c.b === this.toggled.p) {
      //       c.b = this.hovered;
      //     }

      //     if (c.a === c.b) {
      //       del.push(i);
      //     }
      //   }

      //   for (let i of del) {
      //     this.connections.splice(i, 1);
      //   }

      //   this.points.splice(this.toggled.index, 1);
      //   this.toggled = undefined;
      // }
      this.mouseDown = false;
    }
  }


  onMouseMove(e: MouseEvent) {
      // console.log("mousedown", this.mouseDown);

      let x = e.offsetX;
      let y = e.offsetY;
      let mousePos = { x, y };

      this.hovered = undefined;

      for (const point of this.cartez.points) {
        if (this.toggled && this.toggled.p === point) { continue; }

        if (this.distWithin(this.cartez.pixelPosToCord(mousePos), point.cords, TOGGLE_DIST)) {
          this.hovered = point;
          break;
        }
      }
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
