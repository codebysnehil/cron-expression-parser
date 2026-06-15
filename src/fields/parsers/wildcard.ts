import { FieldParser } from '../../types/FieldParser';
import { range } from '../../utils/range';

export class WildcardParser implements FieldParser {
  canHandle(expression: string): boolean {
    return expression === '*';
  }

  parse(_expression: string, min: number, max: number): number[] {
    return range(min, max);
  }
}
