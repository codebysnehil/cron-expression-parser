export interface FieldDefinition {
  name: string;
  min: number;
  max: number;
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  { name: 'minute',       min: 0, max: 59 },
  { name: 'hour',         min: 0, max: 23 },
  { name: 'day of month', min: 1, max: 31 },
  { name: 'month',        min: 1, max: 12 },
  { name: 'day of week',  min: 0, max: 6  },
];
