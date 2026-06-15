import { FieldParser } from '../types/FieldParser';
import { WildcardParser } from './parsers/wildcard';
import { StepParser } from './parsers/step';
import { RangeParser } from './parsers/range';
import { ValueParser } from './parsers/value';
import { ListParser } from './parsers/list';

// checks list first since a list can contain any of the other forms inside it
// then falls through wildcard → step → range → value
export class FieldResolver {
  private readonly wildcard = new WildcardParser();
  private readonly step = new StepParser();
  private readonly range = new RangeParser();
  private readonly value = new ValueParser();
  private readonly list = new ListParser(this); // needs ref back to us for recursion

  resolve(expression: string, min: number, max: number): number[] {
    if (this.list.canHandle(expression)) {
      return this.list.parse(expression, min, max);
    }
    return this.resolveSingle(expression, min, max);
  }

  // kept separate so ListParser can call back in without hitting the list check again
  resolveSingle(expression: string, min: number, max: number): number[] {
    const parsers: Array<{ canHandle(e: string): boolean } & FieldParser> = [
      this.wildcard,
      this.step,
      this.range,
      this.value,
    ];

    for (const parser of parsers) {
      if (parser.canHandle(expression)) {
        return parser.parse(expression, min, max);
      }
    }

    throw new Error(`unknown expression: "${expression}"`);
  }
}
