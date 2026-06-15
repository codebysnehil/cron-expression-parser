import { CronParser } from "./parser";
import { CronFormatter } from "./formatter";

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('usage: cron-parser "<expression>"');
    console.error('e.g.   cron-parser "*/15 0 1,15 * 1-5 /usr/bin/find"');
    process.exit(1);
  }

  try {
    const parsed = new CronParser().parse(args[0]);
    console.log(new CronFormatter().format(parsed));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();
