import { FieldParser } from '../../types/FieldParser';
import { FieldResolver } from '../resolver';

export class ListParser implements FieldParser {
  constructor(private readonly resolver: FieldResolver) {}

  canHandle(expression: string): boolean {
    return expression.includes(',');
  }

  parse(expression: string, min: number, max: number): number[] {
    const results = new Set<number>();

    for (const part of expression.split(',')) {
      // delegate each segment back — could be a range, step, value, anything
      this.resolver
        .resolveSingle(part.trim(), min, max)
        .forEach((v) => results.add(v));
    }

    return Array.from(results).sort((a, b) => a - b);
  }
}
