import * as wasm from "algebrars";
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CartezComponent, FunctionDescription, PRIMARY_COLOR, Point, Pos } from '../cartez/cartez.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { ThemeServiceService } from '../theme-service.service';
import { MathInputComponent } from "../math-input/math-input.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { SketchService } from "../sketch.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UploadDialogComponent } from "../upload-dialog/upload-dialog.component";
import { ActivatedRoute } from "@angular/router";
import { Sketch } from "../../api_bindings/Sketch";

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
  imports: [CartezComponent, MatCardModule, CommonModule, MatInputModule, FormsModule, MathInputComponent, MatListModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './sketcher.component.html',
  styleUrl: './sketcher.component.css'
})

export class SketcherComponent implements OnInit, AfterViewInit {

  letterIt = makeLetterIterator();
  expressions: string[] = [''];
  functions: FunctionDescription[] = [];
  lines: string[] = [];
  hovered?: Point;
  toggled?: Point;
  hoverCord?: Pos;
  analytical: boolean = false;
  mouseDown = false;

  @ViewChild(CartezComponent, { static: true })
  cartez!: CartezComponent;
  public myMath = Math;

  constructor(private theme: ThemeServiceService,
    private sketchService: SketchService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      const sketch_param = params['sketch'];
      if (!sketch_param) { return; }
      const sketch = JSON.parse(sketch_param) as Sketch;
      for (let i = 0; i < sketch.data.length; i++) {
        const fn = sketch.data[i];
        this.changeFn(i, fn.latex);
      }
      console.log({sketch})
    });
  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();
  }

  changeFn(index: number, val: string) {
    const expr = val;
    // exprexpr.replace('\\cdot', '*');
    
    if (index === this.expressions.length - 1 && expr !== "") {
      this.expressions.push("")
    }
    this.expressions[index] = val;
    console.log("expression change", {index, expr})
    
    const new_func = {
      latex: expr,
      color: FUNCTION_COLORS[index % FUNCTION_COLORS.length]
    };

    if (this.functions.length > index) {
      this.functions[index] = new_func;
      // console.log('changing func: ', index, new_func)
    } else {
      // console.log('adding func: ', index, new_func)
      this.functions.push(new_func);
    }
    this.cartez.refreshFunctions();
    
    // to update expressions and math inputs
    this.changeDetector.detectChanges();
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

  shareClick(event: MouseEvent) {
    let dialog = this.dialog.open(UploadDialogComponent);
    dialog.afterClosed().subscribe(name => {
      console.log('The dialog was closed');
      console.log('name', name);
      if (!name) {
        // alert('Name required');
        return;
      }

      this.sketchService.upload({ name, data: this.functions }).subscribe({
        next: ok => {
          console.log("Sketch uploaded, id:", ok)
        },
        error: e => {

        }
      })
    });

  }
}