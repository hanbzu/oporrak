import { expect, test } from "vitest";
import { parseDates, parseRunDays } from "./hafasTools.js";

// I want a javascript function that takes a string describing when a train runs and returns the information in a structured format with the following fields:
// - period: Optional, with format ["YYYYMMDD", "YYYYMMDD"] where the validity range is specified
// - pattern: Optional, with format "0000011" the 0s and 1s represent days of the week starting from Monday. This amends negativelly the validity range.
// - also: amends the previous entry including exta days of operation in the format of array of either "YYYYMMDD" dates or ["YYYYMMDD", "YYYYMMDD"] periods.
// - not: amends all the previous entries by removing the specified days of operation in the format of either "YYYYMMDD" dates or ["YYYYMMDD", "YYYYMMDD"] periods.
const VALIDITY_PERIOD = ["20250101", "20251231"];

test("Simple range", () =>
  expect(parseDates("8. Mar until 19. Apr 2025", VALIDITY_PERIOD)).toEqual([
    ["20250308", "20250419"],
  ]));

test("Simple range, more omissions", () =>
  expect(parseDates("7. until 11. Apr 2025", VALIDITY_PERIOD)).toEqual([
    ["20250407", "20250411"],
  ]));

test("Simple range, previous year", () =>
  expect(parseDates("5. Jan 2024 until 20. Apr", VALIDITY_PERIOD)).toEqual([
    ["20240105", "20250420"],
  ]));

test("Tricky list of dates, no year provided", () =>
  expect(
    parseDates("25. Dec, 1. Jan, 14., 17., 21., 24. Feb", [
      "20241216",
      "20250411",
    ]),
  ).toEqual([
    "20241225",
    "20250101",
    "20250214",
    "20250217",
    "20250221",
    "20250224",
  ]));

test("Now combined", () =>
  expect(
    parseDates(
      "9. Mar, 16. until 20. Mar 2025, 23. Mar, 7. until 11. Apr 2025, 14., 18. Apr",
      VALIDITY_PERIOD,
    ),
  ).toEqual([
    "20250309",
    ["20250316", "20250320"],
    "20250323",
    ["20250407", "20250411"],
    "20250414",
    "20250418",
  ]));

test("case A", () =>
  expect(
    parseRunDays(
      "runs 8. Mar until 19. Apr 2025 Sa; also 9. Mar, 16. until 20. Mar 2025, 23. Mar, 7. until 11. Apr 2025, 14., 18. Apr",
      VALIDITY_PERIOD,
    ),
  ).toEqual({
    period: ["20250308", "20250419"],
    pattern: "0000010",
    also: [
      "20250309",
      ["20250316", "20250320"],
      "20250323",
      ["20250407", "20250411"],
      "20250414",
      "20250418",
    ],
  }));

test("case B", () =>
  expect(
    parseRunDays("runs 8. Mar until 20. Apr 2025 Sa, Su", VALIDITY_PERIOD),
  ).toEqual({
    period: ["20250308", "20250420"],
    pattern: "0000011",
  }));

test("case C", () =>
  expect(
    parseRunDays(
      "runs 16. Dec 2024 until 11. Apr 2025 Mo - Fr; not 25. Dec, 1. Jan, 14., 17., 21., 24. Feb",
      VALIDITY_PERIOD,
    ),
  ).toEqual({
    period: ["20241216", "20250411"],
    pattern: "1111100",
    not: [
      "20241225",
      "20250101",
      "20250214",
      "20250217",
      "20250221",
      "20250224",
    ],
  }));

test("case D", () =>
  expect(parseRunDays("runs 26. until 28. Mar 2025", VALIDITY_PERIOD)).toEqual({
    period: ["20250326", "20250328"],
  }));

test("case E", () =>
  expect(
    parseRunDays(
      "runs daily, not 31. Mar until 25. Apr 2025, 12. May until 5. Jun 2025, 22. until 26. Sep 2025, 9. until 15. Nov 2025",
      VALIDITY_PERIOD,
    ),
  ).toEqual({
    not: [
      ["20250331", "20250425"],
      ["20250512", "20250605"],
      ["20250922", "20250926"],
      ["20251109", "20251115"],
    ],
  }));

test("case F", () =>
  expect(
    parseRunDays(
      "runs daily, not 31. Mar until 25. Apr 2025, 12. May until 5. Jun 2025, 22. until 26. Sep 2025, 9. until 15. Nov 2025",
      VALIDITY_PERIOD,
    ),
  ).toEqual({
    not: [
      ["20250331", "20250425"],
      ["20250512", "20250605"],
      ["20250922", "20250926"],
      ["20251109", "20251115"],
    ],
  }));

test.only("case G", () =>
  expect(
    parseRunDays(
      `        5    10   15   20   25   30
----+----+----+----+----+----+-
Dec     ¦    ¦    ¦xxxxx  x ¦    ¦
Jan     ¦ xxxx  xxxxx  xxxxx¦ xxxxx
Feb     ¦    xxxxx¦ xxxxx  xxxxx ¦
Mar   xxxxx  xxxxx¦ xxxxx  xxxxx ¦x
Apr xxxx¦ xxxxx  xxxxx ¦ xxxx  xxx
May     xxx  ¦ xxxxx  xxxxx ¦xxx ¦
Jun  xxxxx   xxxx ¦xxxxx  xxxx   x
Jul xxx ¦    ¦    ¦    ¦    ¦    ¦
Sep xxxxx  xxxxx  xxxxx¦ xxxxx  xx
Oct xxx ¦xxxxx  xxxx   xxxxx¦ xxxxx
Nov   xxxxx  ¦ xxx¦ xxxxx  xxxxx ¦
Dec xxxxx  xxxxx  ¦    ¦    ¦    ¦`,
      ["20241201", "20251231"],
    ),
  ).toEqual({
    also: [
      "20241215",
      // "20241220",
      // "20250105",
      // "20250110",
      // "20250115",
      // "20250125",
      // "20250210",
      // "20250215",
      // "20250220",
      // "20250305",
      // "20250310",
      // "20250320",
      // "20250330",
      // "20250405",
      // "20250415",
      // "20250420",
      // "20250425",
      // "20250510",
      // "20250515",
      // "20250520",
      // "20250605",
      // "20250615",
      // "20250620",
      // "20250630",
      // "20250705",
      // "20250905",
      // "20250910",
      // "20250915",
      // "20250920",
      // "20251005",
      // "20251015",
      // "20251020",
      // "20251110",
      // "20251120",
      // "20251205",
      // "20251210",
    ],
  }));
