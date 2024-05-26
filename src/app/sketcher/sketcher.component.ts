import * as wasm from "algebrars";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartezComponent, PRIMARY_COLOR, Point, Pos } from '../cartez/cartez.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatListModule} from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { ThemeServiceService } from '../theme-service.service';
import { MathInputComponent } from "../math-input/math-input.component";
import { MatIconModule } from "@angular/material/icon";

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

const FUNCTION_COLORS = [
  PRIMARY_COLOR,
  "#1dd1a1",
  "#feca57",
  "#ff6b6b",
  "#5f27cd"
]


@Component({
  selector: 'app-sketcher',
  standalone: true,
  imports: [CartezComponent, MatCardModule, CommonModule, MatInputModule, FormsModule, MathInputComponent, MatListModule, MatIconModule],
  templateUrl: './sketcher.component.html',
  styleUrl: './sketcher.component.css'
})

export class SketcherComponent {
  letterIt = makeLetterIterator();
  expressions: string[] = [''];
  lines: string[] = [];
  hovered?: Point;
  toggled?: Point;
  hoverCord?: Pos;
  analytical: boolean = false;
  mouseDown = false;

  @ViewChild(CartezComponent, { static: true })
  cartez!: CartezComponent;
  public myMath = Math;

  color: string = 'black';
  constructor(private theme: ThemeServiceService) {
    this.color = this.theme.darkMode ? "white" : "black";
    this.theme.emitter.subscribe((mode) => {
      this.color = mode ? "white" : "black";
    });
  }
  

  changeFn(index: number, val: string) {
    this.expressions[index] = val;
    this.cartez.clearFunctions();
    for (let i = 0; i < this.expressions.length; i++) {
      const expr = this.expressions[i];
      this.cartez.addFunction(expr, FUNCTION_COLORS[i % FUNCTION_COLORS.length])
    }

    if (index === this.expressions.length - 1 && this.expressions[index] !== "") {
      this.expressions.push("")
    }
  }
  onCord(cords: Pos) {
    // console.log(cord) 
    // round for pretty numbers

    cords = {
      x: Math.round(cords.x * 100) / 100, y: Math.round(cords.y * 100) / 100
    };

    this.hoverCord = cords;
  }

  onHover(point: Point | undefined) {
    this.hovered = point;
  }

  onMouseDown(e: MouseEvent) {

    // left click 
    if (e.button === 0) {
      // if (this.hovered) {
      // check hovered
      this.cartez.togglePoint(this.hovered);
      // }
    }

    // right click
    if (e.button !== 2) {
      // this.toggled = undefined;
      return;
    }


    if (!this.hoverCord) { return; }

    let letter = this.letterIt.next().value;
    this.cartez.addPointCords(this.hoverCord, letter);
    this.cartez.togglePoint();
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