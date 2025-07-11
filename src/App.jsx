import _ from "lodash";
import "./App.css";
import React from "react";

function App() {
  const [expandedStep, setExpandedStep] = React.useState(0);
  const [route, setRoute] = React.useState([
    {
      date: "2025-02-28",
      arr: undefined,
      stationId: "Sant Cugat",
      trainId: undefined,
    },
  ]);
  console.log("route", route);
  return (
    <>
      {route.map(({ date, arr, stationId, trainId }, i) => (
        <Step
          key={i}
          stationId={stationId}
          trainId={trainId}
          arr={arr}
          collapsed={i < route.length - 1}
          selected={i === expandedStep}
          onClick={() => setExpandedStep(i)}
        />
      ))}

      <pre style={{ textAlign: "left" }}>{JSON.stringify(route, null, 2)}</pre>

      {expandedStep !== undefined && (
        <JumpOnTrain
          {...route[expandedStep]}
          onPickDestination={(pickedStationId, trainId, arr) => {
            setRoute((r) => [
              ...r.slice(0, expandedStep),
              { ...r[expandedStep], trainId },
              {
                date: route[expandedStep].date,
                arr,
                stationId: pickedStationId,
              },
            ]);
            setExpandedStep(expandedStep + 1);
          }}
        />
      )}
    </>
  );
}

function Step({ stationId, trainId, onClick, arr, selected }) {
  const what = useData({
    filter: { trainId: [trainId], stationId: [stationId], type: ["d"] },
  });
  console.log("what", what?.[0]);
  const { hhmm: dep } = what?.[0] || {};

  return (
    <div
      onClick={onClick}
      style={{
        width: 200,
        textAlign: "left",
        color: "white",
        background: "salmon",
        border: selected ? "2px solid cyan" : "2px solid black",
        cursor: "pointer",
      }}
    >
      <div>
        <span style={{ fontStyle: "italic", fontSize: "0.6em" }}>{arr}</span>{" "}
        {stationId}
      </div>
      <div>
        <span style={{ fontWeight: 700 }}>{dep}</span> {trainId}
      </div>
    </div>
  );
}

function JumpOnTrain({ stationId, arr, trainId, onPickDestination }) {
  const trainsDep = getTrains(
    useData({ filter: { stationId: [stationId], type: ["d"] } }),
  );
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "white",
        color: "black",
      }}
    >
      <span style={{ fontStyle: "italic" }}>{arr}</span> {stationId}, irteerak
      {trainsDep.map((d) => (
        <Train
          key={d}
          id={d}
          from={stationId}
          onPickDestination={onPickDestination}
          isSelected={d === trainId}
        />
      ))}
    </div>
  );
}

function Train({
  id: trainId,
  from: fromStationId,
  isSelected,
  onPickDestination,
}) {
  const data = useData({ filter: { trainId: [trainId] } });
  const fromIndex = data.findIndex(
    (d) => d.stationId === fromStationId && d.type === "d",
  );

  return (
    <div style={{ background: isSelected ? "pink" : undefined }}>
      <div style={{ color: "gray" }}>
        {data[fromIndex]?.hhmm} {trainId}
      </div>
      {data.slice(fromIndex + 1).map((d) => {
        return (
          <div
            key={d.hhmm}
            onClick={() => onPickDestination(d.stationId, trainId, d.hhmm)}
            style={{ cursor: "pointer" }}
          >
            <span style={{ fontStyle: d.type === "a" ? "italic" : undefined }}>
              {d.hhmm}
            </span>{" "}
            {d.stationId}
          </div>
        );
      })}
    </div>
  );
}

export default App;

function useData({ filter }) {
  return DATA.filter((d) =>
    Object.entries(filter).every(([key, values]) => values.includes(d[key])),
  );
}

function getTrains(data) {
  return _.uniq(data.map((d) => d.trainId));
}

function pretty(arr) {
  return arr
    .map(
      ({ hhmm, stationId, type, trainId }) =>
        `${type.toUpperCase()} ${hhmm} ${stationId} · ${trainId}`,
    )
    .join("\n");
}

const DATA = [
  ["8:44", "Sant Cugat", "d", "R8 a"],
  ["9:10", "Granollers", "a", "R8 a"],
  ["9:48", "Granollers", "d", "R11 a"],
  ["11:51", "Portbou", "a", "R11 a"],
  ["11:56", "Cervera", "a", "R11 a"],
  ["12:06", "Portbou", "d", "TER a"],
  ["13:54", "Narbonne", "a", "TER a"],
  ["14:12", "Narbonne", "d", "TER b"],
  ["15:49", "Toulouse", "a", "TER b"],
  ["12:27", "Cervera", "d", "TER c"],
  ["12:41", "Collioure", "a", "TER c"],
  ["14:37", "Collioure", "d", "TER d"],
  ["15:52", "Narbonne", "a", "TER d"],
  ["16:41", "Collioure", "d", "TER e"],
  ["17:53", "Narbonne", "a", "TER e"],
  ["18:42", "Collioure", "d", "TER f"],
  ["19:55", "Narbonne", "a", "TER f"],
  ["16:08", "Narbonne", "d", "TER g"],
  ["17:43", "Toulouse", "a", "TER g"],
  ["18:13", "Narbonne", "d", "TER h"],
  ["19:47", "Toulouse", "a", "TER h"],
].map(([hhmm, stationId, type, trainId]) => ({
  hhmm,
  stationId,
  type,
  trainId,
}));

// Maybe forget about this for now
const runs = [
  { from: "2025-01-01", to: "2025-07-04", weekdays: "●●●●●●·" },
  { on: "2025-08-30" }, // Day additions
  { not: "2025-01-02" }, // Exceptions
];

/*

------

runs 8. Mar until 19. Apr 2025 Sa; also 9. Mar, 16. until 20. Mar 2025, 23. Mar, 7. until 11. Apr 2025, 14., 18. Apr
runs 8. Mar until 20. Apr 2025 Sa, Su
runs 16. Dec 2024 until 11. Apr 2025 Mo - Fr; not 25. Dec, 1. Jan, 14., 17., 21., 24. Feb
runs 26. until 28. Mar 2025
runs daily, not 31. Mar until 25. Apr 2025, 12. May until 5. Jun 2025, 22. until 26. Sep 2025, 9. until 15. Nov 2025
runs daily, not 31. Mar until 25. Apr 2025, 12. May until 5. Jun 2025, 22. until 26. Sep 2025, 9. until 15. Nov 2025



· Divendres 28
Sant Cugat 8:44 → 9:10 Granollers 9.48 → 11:51? Portbou / → 11:56? Cervera
Directe:
Portbou 12:06 → 13:54 Narbonne 14:12 → 15:49 Toulouse
Amb parada en Collioure:
Cervera 12:27 → 12:41 Collioure
Collioure 14:37 → 15:52 Narbonne 16:08 → 17:43 Toulouse
Collioure 16:41 → 17:53 Narbonne 18:13 → 19:47 Toulouse
Collioure 18:42 → 19:55 Narbonne 20:22 → 21:55 Toulouse (ùltim)

· Dissabte 1
something something ending in Albi

· Diumenge 2
Albi, sense trens

· Dilluns 3
Albi 9:02 → 10:00 Toulouse
Toulouse 10:47 → 13:29 La Tor de Querol
Toulouse 10:02 → 11:54 Narbonne 12:07 → 12:50 Perpinyà
Perpinyà 17:54 → 18:44 Portbou 19:05 → 21:07 Granollers 21:32 → 21:53 (/1h, últim) Sant Cugat

*/

/*
https://fahrplan.oebb.at/bin/query.exe/en?protocol=https:&

*/
