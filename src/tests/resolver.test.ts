import { FieldResolver } from "../fields/resolver";

describe('FieldResolver', () => {
  const resolver = new FieldResolver();

  describe("wildcard (*)", () => {
    it("expands to full range for minutes", () => {
      // input: "*" with range 0-59 → should return all 60 values
      const result = resolver.resolve("*", 0, 59);
      expect(result).toHaveLength(60);
      expect(result[0]).toBe(0);
      expect(result[59]).toBe(59);
    });

    it("expands to full range for hours", () => {
      // input: "*" with range 0-23 → should return all 24 values
      const result = resolver.resolve("*", 0, 23);
      expect(result).toHaveLength(24);
    });
  });

  describe("step (*/n and range/n)", () => {
    it("handles */15 for minutes", () => {
      // input: "*/15" with range 0-59 → every 15th minute
      expect(resolver.resolve("*/15", 0, 59)).toEqual([0, 15, 30, 45]);
    });

    it("handles */2 for hours", () => {
      // input: "*/2" with range 0-23 → every 2nd hour
      expect(resolver.resolve("*/2", 0, 23)).toEqual([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
      ]);
    });

    it("handles range/step like 0-30/10", () => {
      // input: "0-30/10" → every 10th value between 0 and 30
      expect(resolver.resolve("0-30/10", 0, 59)).toEqual([0, 10, 20, 30]);
    });

    it("handles start/step like 5/15", () => {
      // input: "5/15" → every 15th starting from 5
      expect(resolver.resolve("5/15", 0, 59)).toEqual([5, 20, 35, 50]);
    });

    it("throws on invalid step value", () => {
      // input: "*/0" → step of 0 is not valid
      expect(() => resolver.resolve("*/0", 0, 59)).toThrow();
    });
  });

  describe("range (n-m)", () => {
    it("handles 1-5", () => {
      // input: "1-5" with range 1-7 → [1, 2, 3, 4, 5]
      expect(resolver.resolve("1-5", 1, 7)).toEqual([1, 2, 3, 4, 5]);
    });

    it("handles single-element range", () => {
      // input: "3-3" → start and end are same, should return just [3]
      expect(resolver.resolve("3-3", 0, 59)).toEqual([3]);
    });

    it("throws when range exceeds max", () => {
      // input: "0-60" with max 59 → 60 is out of bounds
      expect(() => resolver.resolve("0-60", 0, 59)).toThrow();
    });

    it("throws when range is inverted", () => {
      // input: "10-5" → start is greater than end, invalid
      expect(() => resolver.resolve("10-5", 0, 59)).toThrow();
    });
  });

  describe("list (a,b,...)", () => {
    it("handles 1,15", () => {
      // input: "1,15" with range 1-31 → [1, 15]
      expect(resolver.resolve("1,15", 1, 31)).toEqual([1, 15]);
    });

    it("deduplicates values", () => {
      // input: "5,5,10" → duplicate 5 should appear only once
      expect(resolver.resolve("5,5,10", 0, 59)).toEqual([5, 10]);
    });

    it("handles mixed list items like 1,5-7,10", () => {
      // input: "1,5-7,10" → value + range + value mixed together
      expect(resolver.resolve("1,5-7,10", 0, 59)).toEqual([1, 5, 6, 7, 10]);
    });

    it("handles list with steps like 1,*/30", () => {
      // input: "1,*/30" → */30 gives [0, 30], combined with 1 → [0, 1, 30]
      expect(resolver.resolve("1,*/30", 0, 59)).toEqual([0, 1, 30]);
    });
  });

  describe("exact value", () => {
    it("returns single-element array", () => {
      // input: "0" with range 0-23 → just [0]
      expect(resolver.resolve("0", 0, 23)).toEqual([0]);
    });

    it("throws when value is out of range", () => {
      // input: "24" with max 23 → out of bounds
      expect(() => resolver.resolve("24", 0, 23)).toThrow();
    });

    it("throws for negative values", () => {
      // input: "-1" → picked up by range parser, start > end throws
      expect(() => resolver.resolve("-1", 0, 59)).toThrow();
    });
  });

  describe("unrecognised expression", () => {
    it("throws a descriptive error", () => {
      // input: "abc" → no parser can handle it
      expect(() => resolver.resolve("abc", 0, 59)).toThrow(/unknown expression/);
    });
  });
});
