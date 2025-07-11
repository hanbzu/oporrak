if (
  !window.location.href.startsWith(
    "https://fahrplan.oebb.at/bin/traininfo.exe/en",
  )
)
  alert("This is not the right link!");

function getRun() {
  const tableInText = Array.from(
    document.querySelector("table.resultTable")?.querySelectorAll("tr") || [],
  ).map((row) =>
    Array.from(row.querySelectorAll("td, th"))
      .map((cell) => cell.textContent.trim())
      .map((text) => (text === "" ? undefined : text)),
  );
  const headers = tableInText[0];
  return tableInText
    .slice(1)
    .filter((row) => row.length > 1)
    .map((row) => ({
      sta: row[headers.indexOf("Station")],
      arr: row[headers.indexOf("Arrival")],
      dep: row[headers.indexOf("Departure")],
    }));
}

function getServiceName() {
  return document.querySelector("div.summary span.label")?.textContent?.trim();
}

function getValidity() {
  return document
    .querySelector("span.timetable_validity")
    ?.textContent?.trim()
    ?.substring(54, 78)
    ?.split(" to ")
    ?.map((d) => {
      const [dd, mm, yyyy] = d.split(".");
      return yyyy + mm + dd;
    });
}

function getField(headerText) {
  return Array.from(document.querySelectorAll("td"))
    .map((td) => td.textContent.replace(/\n+/g, "\n"))
    .filter((text) =>
      text
        .replace(/\n+/g, "")
        .trim()
        .toLowerCase()
        .startsWith(headerText.toLowerCase()),
    )?.[0];
}

const result = {
  trainNameSrc: getServiceName(),
  operatorSrc: getField("Operator").replace(/Operator:|,|\s/g, ""),
  scheduleSrc: getRun(),
  validity: getValidity(),
  runsSrc: getField("Days of operation"),
  commentsSrc: getField("Comments"),
};

window.focus();
navigator.clipboard
  .writeText(JSON.stringify(result))
  .then(() => alert(JSON.stringify(result, null, 2)))
  .catch((err) => alert("Click the background to focus the document" + err));
