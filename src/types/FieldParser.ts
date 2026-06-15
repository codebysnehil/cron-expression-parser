export interface FieldParser {
  parse(expression: string, min: number, max: number): number[];
}
