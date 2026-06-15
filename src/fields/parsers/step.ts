import { FieldParser } from "../../types/FieldParser";
import { range } from "../../utils/range";

// handles: */15  →  every 15th from min
//          5/15  →  every 15th starting from 5
//        0-30/10 →  every 10th between 0 and 30
export class StepParser implements FieldParser {
  canHandle(expression: string): boolean {
    return expression.includes("/");
  }

  parse(expression: string, min: number, max: number): number[] {
    const [left, stepStr] = expression.split("/");
    const step = parseInt(stepStr, 10);

    if (isNaN(step) || step <= 0) {
      throw new Error(`invalid step in "${expression}"`);
    }

    let start = min;
    let end = max;

    if (left !== "*") {
      if (left.includes("-")) {
        const [s, e] = left.split("-");
        start = parseInt(s, 10);
        end = parseInt(e, 10);
      } else {
        start = parseInt(left, 10);
      }
    }

    if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
      throw new Error(`out of range in "${expression}" (allowed ${min}-${max})`);
    }

    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  }
}
