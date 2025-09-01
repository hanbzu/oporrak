// Example: "runs 16. Dec 2024 until 11. Apr 2025 Mo - Fr; not 25. Dec, 1. Jan, 14., 17., 21., 24. Feb"

/** Will extract a complex phrase specifying when this train runs */
export function parseRunDays(text, validityPeriod) {
  let period = validityPeriod; // Keep track of it to autocomplete YYYYs
  return text
    .split(";")
    .map((d) => d.trim())
    .flatMap((d) => {
      if (d.startsWith("5    10   15   20   25   30")) return [{ k: "also", v: gridParse(d, validityPeriod) }];
      else if (d.startsWith("not ")) return [{ k: "not", v: parseDates(d.substring(4), period) }];
      else if (d.startsWith("runs daily, not")) return [{ k: "not", v: parseDates(d.substring(16), period) }];
      else if (d.startsWith("also ")) return [{ k: "also", v: parseDates(d.substring(5), period) }];
      else if (d.startsWith("runs ")) {
        const splitIndex = indexOfWeekdayTag(d); // Where do days of the week begin?
        if (splitIndex === -1) {
          // Only period is specified
          period = parseDates(d.substring(5), period)?.[0];
          return [{ k: "period", v: period }];
        } else {
          // Two entries becuse a pattern is specified
          period = parseDates(d.substring(5, splitIndex), period)?.[0];
          return [
            { k: "period", v: period },
            { k: "pattern", v: parsePattern(d.substring(splitIndex)) },
          ];
        }
      }
    })
    .filter(Boolean)
    .reduce((acc, { k, v }) => ({ ...acc, [k]: v }), {});
}

/** Returns the lowestIndex of a weekday tag in the input string or -1 if none found */
function indexOfWeekdayTag(inputStr) {
  let lowestIndex = -1;
  WEEKDAYS.forEach((wd) => {
    const index = inputStr.indexOf(wd);
    if (index !== -1 && (lowestIndex === -1 || index < lowestIndex)) lowestIndex = index;
  });
  return lowestIndex;
}

/** Extract a pattern like 0000011 from a range or list of weekdays */
function parsePattern(inputStr) {
  const maybeRange = inputStr.split("-").map((d) => d.trim());
  const list =
    maybeRange.length === 2 // It was a range, convert it to a list
      ? WEEKDAYS.slice(WEEKDAYS.indexOf(maybeRange[0]), WEEKDAYS.indexOf(maybeRange[1]) + 1)
      : inputStr.split(",").map((d) => d.trim()); // It was an actual list
  return WEEKDAYS.reduce((acc, wd) => acc + (list.includes(wd) ? "1" : "0"), "");
}

/** Extracts dates and date ranges */
export function parseDates(inputStr, validityPeriod) {
  const yearDict = getYearDictFromRange(validityPeriod);
  let lastMonthStr = "MM";
  return inputStr
    .split(",")
    .map((d) => d.trim())
    .reduceRight((acc, d) => {
      const range = getDateRange(d, yearDict);
      if (range) return [range, ...acc];
      const date = getDate(d, lastMonthStr, yearDict);
      lastMonthStr = date?.slice(4, 6); // Keep for next run
      return [date, ...acc];
    }, []);
}

/** Extracts the date range from something like '8. Mar until 19. Apr 2025', where year is optional and will be prefilled with provided default year */
function getDateRange(inputStr, yearDict) {
  const match = inputStr.match(
    /^(\d{1,2})\.\s*(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:\s+(\d{4}))?)?\s+until\s+(\d{1,2})\.\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:\s+(\d{4}))?$/i,
  );
  if (!match) return null;
  const [, fromDay, fromMonth, fromYear, toDay, toMonth, toYear] = match;
  return [
    (fromYear ?? toYear ?? yearDict[MONTHS[fromMonth ?? toMonth]]) + // Omission may mean it's at the end
      MONTHS[fromMonth ?? toMonth] + // Omission may mean it's at the end
      fromDay.padStart(2, "0"),
    (toYear ?? yearDict[MONTHS[toMonth]]) + MONTHS[toMonth] + toDay.padStart(2, "0"),
  ];
}

/** Extracts the date from something like '8. Mar 2024' where month and year are optional, and are prefilled with provided parameters if not present */
function getDate(inputStr, monthDefault = "MM", yearDict) {
  const match = inputStr.match(
    /^(\d{1,2})\.\s*(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))?(?:\s+(\d{4}))?$/i,
  );
  if (!match) return null;
  const [, daySrc, monthSrc, yearSrc] = match;
  const month = monthSrc ? MONTHS[monthSrc] : monthDefault;
  const year = yearSrc ?? yearDict[month] ?? "YYYY";
  return year + month + daySrc.padStart(2, "0");
}

/** Creates a dictionary like { '01': '2024', '02': '2024', ... } to autocomplete YYYY */
function getYearDictFromRange(inputRange) {
  const startYear = +inputRange[0].slice(0, 4);
  const startMonth = +inputRange[0].slice(4, 6);
  const endYear = +inputRange[1].slice(0, 4);
  const endMonth = +inputRange[1].slice(4, 6);
  const expanded = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    expanded.push({ year, month, yearDiff: year - startYear });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  // console.log(expanded);
  return expanded.reduce(
    (acc, { year, month, yearDiff }) => ({
      ...acc,
      [`${month}`.padStart(2, "0") + "." + yearDiff]: `${year}`,
    }),
    {},
  );
}

function gridParse(gridStr, validityPeriod) {
  console.log(validityPeriod);
  const yearDict = getYearDictFromRange(validityPeriod);
  console.log(yearDict);
  const blocksWithoutHeaders = gridStr.split("\n").slice(2);
  console.log(blocksWithoutHeaders);
  console.log(
    blocksWithoutHeaders.flatMap((d) => {
      const mmm = d.substring(0, 3);
      const dayArray = Array.from(d.substring(4));

      return dayArray
        .map((symbol, i) => ({
          doesRun: symbol === "x",
          day: `${i + 1}`.padStart(2, "0"),
          month: MONTHS[mmm],
          year: yearDict[MONTHS[mmm]],
        }))

        .filter((d) => d.doesRun)
        .map(({ year = "YYYY", month = "MM", day }) => year + month + day);
    }),
  );
  return ["HEY"];
}

const MONTHS = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
