import { FieldResolver } from "./fields/resolver";
import { FIELD_DEFINITIONS } from "./types/FieldDefinition";

export interface CronResult {
  fields: Array<{ name: string; values: number[] }>;
  command: string;
}

// 5 time fields + the command
const EXPECTED_PARTS = FIELD_DEFINITIONS.length + 1;

export class CronParser {
  constructor(
    private readonly resolver: FieldResolver = new FieldResolver(),
  ) {}

  parse(cronExpression: string): CronResult {
    const parts = cronExpression.trim().split(/\s+/);

    if (parts.length < EXPECTED_PARTS) {
      throw new Error(
        `Invalid cron expression: expected ${EXPECTED_PARTS} parts, got ${parts.length}`
      );
    }

    const fieldTokens = parts.slice(0, FIELD_DEFINITIONS.length);
    const command = parts.slice(FIELD_DEFINITIONS.length).join(" ");

    const fields = FIELD_DEFINITIONS.map((def, i) => ({
      name: def.name,
      values: this.resolver.resolve(fieldTokens[i], def.min, def.max),
    }));

    return { fields, command };
  }
}
