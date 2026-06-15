import { CronFormatter } from '../formatter';
import { CronResult } from '../parser';

describe('CronFormatter', () => {
  const formatter = new CronFormatter();

  it('formats output matching the spec example', () => {
    // input: already parsed result of "*/15 0 1,15 * 1-5 /usr/bin/find"
    const result: CronResult = {
      fields: [
        { name: 'minute',       values: [0, 15, 30, 45] },
        { name: 'hour',         values: [0] },
        { name: 'day of month', values: [1, 15] },
        { name: 'month',        values: [1,2,3,4,5,6,7,8,9,10,11,12] },
        { name: 'day of week',  values: [1, 2, 3, 4, 5] },
      ],
      command: '/usr/bin/find',
    };

    const output = formatter.format(result);
    const lines = output.split('\n');

    // each line: field name padded to 14 chars + space-separated values
    expect(lines[0]).toBe('minute        0 15 30 45');
    expect(lines[1]).toBe('hour          0');
    expect(lines[2]).toBe('day of month  1 15');
    expect(lines[3]).toBe('month         1 2 3 4 5 6 7 8 9 10 11 12');
    expect(lines[4]).toBe('day of week   1 2 3 4 5');
    expect(lines[5]).toBe('command       /usr/bin/find');
  });

  it('pads field names to 14 characters', () => {
    // input: single field "minute" with value 1
    // "minute" is 6 chars, should be padded with 8 spaces to reach 14
    const result: CronResult = {
      fields: [{ name: 'minute', values: [1] }],
      command: '/bin/sh',
    };
    const [firstLine] = formatter.format(result).split('\n');
    expect(firstLine.startsWith('minute        ')).toBe(true);
  });
});
