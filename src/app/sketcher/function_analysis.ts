import * as wasm from "algebrars";
import { FunctionWrapper, Point } from "../cartez/cartez.component";

export function find_intersection(fw: FunctionWrapper): Point | undefined{
    // x = 0
    let res = fw.fn.evaluate(wasm.TreeNodeRef.zero());
    if (res) {
        let val = res.val();
        if (val.constant) {
            let y = val.constant.toNumber();
            return { cords: { x: 0, y }, letter: "A", bounds: [], auto: true };
        }
    }
    return undefined;
}