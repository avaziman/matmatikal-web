import { MathNode } from "mathjs";

export interface LinearFn {
    equation: MathNode,
    m: MathNode;
    b: MathNode;
}

interface VerticalLine {
    x: MathNode;
}

