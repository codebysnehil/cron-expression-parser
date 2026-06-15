import { CronParser } from "../parser";

describe('CronParser', () => {
  const parser = new CronParser();

  it('parses the example from the spec correctly', () => {
    // input: "*/15 0 1,15 * 1-5 /usr/bin/find"
    const result = parser.parse('*/15 0 1,15 * 1-5 /usr/bin/find');
    expect(result.fields[0]).toEqual({ name: 'minute',       values: [0, 15, 30, 45] });
    expect(result.fields[1]).toEqual({ name: 'hour',         values: [0] });
    expect(result.fields[2]).toEqual({ name: 'day of month', values: [1, 15] });
    expect(result.fields[3]).toEqual({ name: 'month',        values: [1,2,3,4,5,6,7,8,9,10,11,12] });
    expect(result.fields[4]).toEqual({ name: 'day of week',  values: [1, 2, 3, 4, 5] });
    expect(result.command).toBe('/usr/bin/find');
  });

  it('handles a command with spaces', () => {
    // input: "0 12 * * * /usr/bin/find /var -name "*.log""
    // command should be reassembled as a single string
    const result = parser.parse('0 12 * * * /usr/bin/find /var -name "*.log"');
    expect(result.command).toBe('/usr/bin/find /var -name "*.log"');
  });

  it('throws when fewer than 6 parts are provided', () => {
    // input: "* * * *" — only 4 parts, missing day of week and command
    expect(() => parser.parse('* * * *')).toThrow(/Invalid cron expression/);
  });

  it('throws for empty string', () => {
    // input: "" — nothing at all
    expect(() => parser.parse('')).toThrow();
  });

  it('parses all-wildcard expression', () => {
    // input: "* * * * * /bin/true"
    // every field should expand to its full range
    const result = parser.parse('* * * * * /bin/true');
    expect(result.fields[0].values).toHaveLength(60);  // minute: 0-59
    expect(result.fields[1].values).toHaveLength(24);  // hour: 0-23
    expect(result.fields[2].values).toHaveLength(31);  // day of month: 1-31
    expect(result.fields[3].values).toHaveLength(12);  // month: 1-12
    expect(result.fields[4].values).toHaveLength(7);   // day of week: 0-6
  });
});
