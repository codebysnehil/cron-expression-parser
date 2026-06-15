import { CronResult } from "./parser";

const COL_WIDTH = 14;

export class CronFormatter {
  format(result: CronResult): string {
    const lines = result.fields.map(
      ({ name, values }) => `${name.padEnd(COL_WIDTH)}${values.join(" ")}`,
    );
    lines.push(`${"command".padEnd(COL_WIDTH)}${result.command}`);
    return lines.join("\n");
  }
}
