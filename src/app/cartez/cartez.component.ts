import * as wasm from "algebrars";
import { Component, ElementRef, Input, ViewChild, AfterViewInit, HostListener, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Line } from '../logic/line';
import { find_intersection } from '../sketcher/function_analysis';

const DEFAULT_SCALE = 10;
export const PRIMARY_COLOR = "#2196f3";
const TOGGLE_POINT_DIST_PX = 9;
const TOGGLE_DIST_FN_PX = 5;
const TOGGLE_DIST_FN_UNDOCK_PX = 125;

interface PosT<T> {
  x: T,
  y: T
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
  bounds: wasm.Bound[],
  auto: boolean,
}

interface Segment {
  a: Point,
  b: Point
}

export interface FunctionWrapper {
  fn: wasm.Function,
  fast_fn: wasm.FastFunction,
  values: Array<number | undefined>,
  expression_latex: string,
  color?: string,
  calculated_in_ms: number,
}

interface FunctionHover {
  fn: FunctionWrapper,
  hovered_at: Pos
  pos: number
}

@Component({
  selector: 'app-cartez',
  standalone: true,
  imports: [],
  templateUrl: './cartez.component.html',
  styleUrl: './cartez.component.css'
})
export class CartezComponent implements OnInit, OnChanges, AfterViewInit {

  width!: number;
  height!: number;


  @Output() onCord = new EventEmitter<Pos>();
  @Output() onHover = new EventEmitter<Point | undefined>();

  @Input() color = 'black';
  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;

  @ViewChild('drawCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  points: Point[] = [];
  segments: Segment[] = [];
  hoveredPoint?: Point;
  hoveredFunction?: FunctionHover;
  // toggled
  selected?: Point;
  // maybe separate axis
  scale: number = DEFAULT_SCALE;
  view_pos: Pos = { x: 0, y: 0 };

  mouseLeftDown = false;
  vertical_lines: number[] = [];
  functions: FunctionWrapper[] = []

  onResize(event: UIEvent) {
    if (this.container.nativeElement.offsetWidth == this.width) {
      this.draw();
      return;
    }

    this.updateSize(this.container.nativeElement.offsetWidth,
      this.container.nativeElement.offsetHeight);
      console.log("UPDATED WIDTH")
      this.draw();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.context) {
      this.draw();
    }
  }

  addPointCords(cords: Pos, letter: string, auto = false) {

    let point = undefined;
    let last_point = undefined;
    if (this.hoveredPoint) {
      point = this.hoveredPoint;
      last_point = this.points.at(-1) as Point;
    } else {
      let bounds = [];
      if (this.hoveredFunction) {
        cords = this.hoveredFunction.hovered_at;
        bounds.push(wasm.Bound.belongs_to_fn(this.hoveredFunction.pos))
      }
      let p = {
        letter: letter,
        cords: { x: cords.x, y: cords.y },
        auto,
        bounds
      };
      this.points.push(p);
      point = p;
      last_point = this.points.at(-2) as Point;
    }


    if (this.selected) {
      last_point = this.selected;
    }


    if (this.points.length > 1) {
      // const m = (point.cords.y - last_point.cords.y) / (point.cords.x - last_point.cords.x);

      this.segments.push({ a: last_point, b: point });
      // this.addLine({
      //   id: this.lines.length,
      //   m: m, b: -m * point.cords.x + point.cords.y,
      //   ranges: [{ from: Math.min(point.cords.x, last_point.cords.x), to: Math.max(point.cords.x, last_point.cords.x) }]
      // });
    }
    this.draw();

    // console.log(this.points);
  }

  clearFunctions() {
    this.functions.splice(1, this.functions.length - 1);
  }

  addFunction(expr: string, color?: string) {
    try {
      const tree = wasm.MathTree.parse(expr);
      console.log("Added func", tree.to_latex());

      const fn = wasm.Function.from(tree);
      const fast_fn = wasm.FastFunction.from(fn);
      const wrapped_fn = { fn, fast_fn, color, expression_latex: expr, values: Array(this.width).fill(undefined), calculated_in_ms: 0 };
      this.calculateFnValues(wrapped_fn);

      this.functions.push(wrapped_fn);


      try {
        let intersection = find_intersection(wrapped_fn);
        console.log("INTERSECTION AT", intersection)
        if (intersection) {
          this.addPointCords(intersection.cords, "", true);
        }
      } catch {
        console.log("Failed to find intersection");
      }

      this.draw();
      // this is done to apply bounds to points (make them stay on the func etc)
      for (const point of this.points) {
        this.movePoint(point, point.cords);
      }
    } catch {
      console.log("Failed to parse func: ", expr)
    }
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


  pixelPosToCordPretty(pos: Pos): Pos {
    let cords = this.pixelPosToCord(pos);
    cords.x = Math.round(cords.x * 100) / 100;
    cords.y = Math.round(cords.y * 100) / 100;
    return cords;
  }

  drawVerticalLine(x: number) {
    this.drawLine({ x, y: this.view_pos.y }, { x, y: this.view_pos.y + this.getRange().y });
  }

  drawLine(p1: Pos, p2: Pos) {
    this.context.lineWidth = 2;
    this.context.strokeStyle = this.color;
    this.context.beginPath();

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

  ngOnInit() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      this.context = ctx;
    }
    this.updateSize(this.container.nativeElement.offsetWidth,
      this.container.nativeElement.offsetHeight);

    this.context.fillStyle = "#eeeeee";
    this.context.fillRect(0, 0, this.width, this.height);

    this.addFunction("0");
    this.addVerticalLine(0);
    this.draw();
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  updateSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    let range = this.getRange();
    console.log({ w: this.width, h: this.height, s: this.scale, r: range });

    this.view_pos = { x: -range.x / 2, y: -range.y / 2 };

  }

  calculateFns() {
    for (const fn of this.functions) {
      this.calculateFnValues(fn);
    }
  }

  calculateFnValues(wrapped_fn: FunctionWrapper) {
    // let start = performance.now();
    // calculate points
    for (let i = 0; i < this.width; i += 1) {
      const x = this.pixelPosToCord({ x: i, y: 0 }).x;

      try {
        let evaluated = wrapped_fn.fast_fn.evaluate_float([wasm.VariableVal.new("x", x)]);
        wrapped_fn.values[i] = evaluated;
        // console.log({x, y})
      } catch {
        wrapped_fn.values[i] = undefined;
      }
    }
    // let elapsed = performance.now() - start;
    // console.log("ELAPSED", elapsed)
    // elapsed = Math.round(elapsed * 1000) / 1000;
    // wrapped_fn.calculated_in_ms = elapsed;
  }

  drawTeeth() {
    const TEETH_PER_AXIS = 10;
    // size is constant in pixels, not in coordinates
    this.context.fillStyle = this.color;
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
    // console.time("draw");
    this.context.clearRect(0, 0, this.width, this.height);

    for (const vl of this.vertical_lines) {
      this.drawVerticalLine(vl);
    }

    for (const p of this.points) {
      const POINT_SIZE = 5;

      if (p === this.hoveredPoint || p == this.selected) {
        this.drawPoint(p, TOGGLE_POINT_DIST_PX, PRIMARY_COLOR);
      }
      this.drawPoint(p, POINT_SIZE, this.color);
    }


    this.context.fillStyle = "black";

    this.drawTeeth();

    for (const fn of this.functions) {
      this.drawFunction(fn);
    }

    for (const segment of this.segments) {
      this.drawLine(segment.a.cords, segment.b.cords);
    }
    // console.timeEnd("draw");
  }

  drawFunction(f: FunctionWrapper) {
    // console.time("draw fn");

    this.context.beginPath();
    const MAX_Y = this.view_pos.y + this.getRange().y;
    const MIN_Y = this.view_pos.y;

    let out_of_range = null;
    for (let i = 0; i < this.width; i += 1) {
      let y = f.values[i];

      if (y == undefined) {
        continue;
      }

      let oor = null;
      if (y > MAX_Y) {
        y = MAX_Y;
        oor = MAX_Y;
      } else if (y < MIN_Y) {
        y = MIN_Y;
        oor = MIN_Y;
      }

      const ppos = { x: i, y: this.cordToPixelPos({ x: 0, y }).y };

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

    if (this.hoveredFunction?.fn === f) {
      this.context.lineWidth = 3;
    } else {
      this.context.lineWidth = 2;
    }
    this.context.strokeStyle = f.color ? f.color : this.color;
    this.context.stroke();
    // console.timeEnd("draw fn");
  }
  shortNum(n: number): string {
    let res = n.toString();

    // let scientific = n.toExponential();
    // if (res.length > scientific.length) {
    //   return scientific;
    // }

    return res;
  }

  togglePoint(p?: Point) {
    this.selected = p;
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

    this.calculateFns();
    this.draw();
  }

  releasePoint(point: Point, pos: Pos) {
    // dock it!
    if (this.hoveredFunction) {
      // apply the proper pos
      point.bounds.push(
        wasm.Bound.belongs_to_fn(this.hoveredFunction.pos)
      )
      console.log("Docked to function:", this.hoveredFunction.fn.expression_latex)
    }

    // merge points, hovered becomes selected
    if (this.selected && this.hoveredPoint) {
      for (const seg of this.segments) {
        if (seg.a === this.selected) {
          seg.a = this.hoveredPoint;
        } else if (seg.b === this.selected) {
          seg.b = this.hoveredPoint;
        }
      }

      this.points.splice(this.points.indexOf(this.selected), 1);
      this.selected = this.hoveredPoint;
      this.draw();
    }
  }

  movePoint(point: Point, pos: Pos) {
    // cant move auto points
    if (point.auto) {
      return;
    }

    const ppos = this.cordToPixelPos(pos);
    if (point.bounds.length > 0) {
      let bound = point.bounds[0];
      if (bound.kind == wasm.BoundType.BelongsToFunction && bound.function_id) {
        let closest = this.closestToFnWithinDist(this.functions[bound.function_id], ppos, this.width /* TOGGLE_DIST_FN_UNDOCK_PX */);
        if (closest) {
          pos = closest.pos;
        } else {
          // user undocks the point from the function, remove bound
          console.log("Undocked from function:", this.functions[bound.function_id].expression_latex)
          point.bounds = [];
        }
      }
    }
    // users docks point to function
    else if (this.hoveredFunction) {
      // apply the proper pos
      let closest = this.closestToFnWithinDist(this.hoveredFunction.fn, ppos, TOGGLE_DIST_FN_PX);
      if (closest) {
        pos = closest.pos;
      }
    }

    point.cords = pos;
    this.draw();

  }

  onMouseMove(e: MouseEvent) {
    let ppos = { x: e.offsetX, y: e.offsetY };
    let cords = this.pixelPosToCord(ppos);
    this.onCord.emit(cords);

    let hoveredPoint = this.points.find(
      (p) => p !== this.selected && this.distWithin(cords, p.cords, TOGGLE_POINT_DIST_PX / this.scale));

    if (this.hoveredPoint != hoveredPoint) {
      this.onHover.emit(hoveredPoint);
      this.hoveredPoint = hoveredPoint;
      this.draw();
    }


    let hoveredFunction = undefined;
    let i = 0;
    for (const fn of this.functions) {
      let closest = this.closestToFnWithinDist(fn, ppos, TOGGLE_DIST_FN_PX);
      if (closest && closest.dist <= TOGGLE_DIST_FN_PX) {
        hoveredFunction = {
          dist: closest?.dist, hovered: { fn, hovered_at: closest?.pos, pos: i },
        };
      }
      i++;
    }

    if (this.hoveredFunction !== hoveredFunction) {
      this.hoveredFunction = hoveredFunction?.hovered;
      this.draw();
    }


    if (e.buttons === 1) {
      this.mouseLeftDown = true;
      if (this.selected) {
        this.movePoint(this.selected, cords);
        return;
      }
    } else if (this.mouseLeftDown === true) {
      this.mouseLeftDown = false;
      if (this.selected) {
        this.releasePoint(this.selected, cords);
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
    this.calculateFns();
    this.draw();

  }
  closestToFnWithinDist(fn: FunctionWrapper, ppos: Pos, toggle_dist: number): { pos: Pos, dist: number } | undefined {
    let point_and_dist = undefined;
    for (let x = Math.max(0, ppos.x - toggle_dist); x < Math.max(ppos.x + toggle_dist, this.width); x += 1) {
      let yVal = fn.values[x];
      if (yVal) {
        let y = this.cordToPixelPos({ x: 0, y: yVal }).y;
        let dist = this.dist(ppos, { x, y });
        if (dist <= toggle_dist && (!point_and_dist || dist <= point_and_dist?.dist)) {

          point_and_dist = { pos: this.pixelPosToCord({ x, y }), dist };
        }

      }
    }

    return point_and_dist;
  }


  dist(p1: Pos, p2: Pos) {

    let dx = Math.abs(p1.x - p2.x);
    let dy = Math.abs(p1.y - p2.y);
    return Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
  }

  distWithin(p1: Pos, p2: Pos, d: number): boolean {
    return this.dist(p1, p2) < d;
  }

}