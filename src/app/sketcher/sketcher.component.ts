import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartezComponent, Point, Pos } from '../cartez/cartez.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import * as wasm from "algebrars";

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
  imports: [CartezComponent, MatCardModule, CommonModule, MatInputModule],
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
  hoverCord?: Pos;
  analytical: boolean = false;
  mouseDown = false;
  
  @ViewChild(CartezComponent, { static: true })
  cartez!: CartezComponent;
  public myMath = Math;
  
  onFnChange(s: any) {
    this.cartez.addFunction(s.target.value)
  }
  onCord(cords: Pos) {
    // console.log(cord) 
    // round for pretty numbers
    cords = {
      x: Math.round(cords.x * 100) / 100, y: Math.round(cords.y * 100) / 100
    };

    let fn = wasm.Function.from(wasm.MathTree.parse("x^2"));
    let res = fn.evaluate(wasm.TreeNodeRef.one());

    if (res) {
      let val = res.val(); 
      console.log(val);
      if (val.constant) {
        console.log(val.constant.toNumber())
      }
   } 
    this.hoverCord = cords;
  }
  
  onHover(point: Point | undefined) {
    this.hovered = point;
  }

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

    if (!this.hoverCord) { return; }

    let letter = this.letterIt.next().value;
    this.cartez.addPointCords(this.hoverCord, letter);
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

    let x = e.offsetX;
    let y = e.offsetY;
    let mousePos = { x, y };

    // this.hovered = undefined;

  }

}