import { FieldParser } from "../../types/FieldParser";

export class ValueParser implements FieldParser {
  canHandle(expression: string): boolean {
    return /^\d+$/.test(expression);
  }

  parse(expression: string, min: number, max: number): number[] {
    const val = parseInt(expression, 10);

    if (val < min || val > max) {
      throw new Error(`${val} is out of range (allowed ${min}-${max})`);
    }

    return [val];
  }
}
