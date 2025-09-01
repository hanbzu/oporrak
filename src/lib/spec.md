# Traditional HAFAS interface parsing

These traditional interfaces, used in older versions of ÖBB Scotty, represent service run days with a string similar to:

```
runs 16. Dec 2024 until 11. Apr 2025 Mo - Fr; not 25. Dec, 1. Jan, 14., 17., 21., 24. Feb
```

Or to:

```
        5    10   15   20   25   30
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
Dec xxxxx  xxxxx  ¦    ¦    ¦    ¦
```

## Structured output

For working with this data we need to structure it to:

```js
{
  period: ["YYYYMMDD", "YYYYMMDD"], // Validity range
  pattern: "0000011", // Run pattern, where 0s and 1s represent days of the week starting from Monday. This amends negativelly the validity range.
  also: [ "YYYYMMDD", ["YYYYMMDD", "YYYYMMDD"]], // amends the previous entry including exta days of operation in the format of array of either "YYYYMMDD" dates or ["YYYYMMDD", "YYYYMMDD"] periods.
  not: ["YYYYMMDD", ["YYYYMMDD", "YYYYMMDD"]] // amends all the previous entries by removing the specified days of operation in the format of either "YYYYMMDD" dates or ["YYYYMMDD", "YYYYMMDD"] periods.
}
```

All entries are optional, amending previous information in sequence.

## Implementation

A `parseDates` function converts to `YYYYMMDD` a list of dates, with ellipsis and other excepcionalities. This function is then used by `parseRunDays` which account for the logic (inclussion, exclussion) to return the output we need.
