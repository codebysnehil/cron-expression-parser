import { FieldParser } from '../../types/FieldParser';
import { range } from '../../utils/range';

export class RangeParser implements FieldParser {
  canHandle(expression: string): boolean {
    return expression.includes('-');
  }

  parse(expression: string, min: number, max: number): number[] {
    const [s, e] = expression.split('-');
    const start = parseInt(s, 10);
    const end = parseInt(e, 10);

    if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
      throw new Error(`invalid range "${expression}" (allowed ${min}-${max})`);
    }

    return range(start, end);
  }
}
