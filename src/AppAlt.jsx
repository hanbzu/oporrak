import _ from "lodash";
import "./App.css";
import React from "react";
import { useFuzzySearchList, Highlight } from "@nozbe/microfuzz/react";
import dataGathered from "./data-gathered";

const dataByTrain = dataGathered.reduce(
  (acc, d) => ({ ...acc, [d.trainNameSrc]: d }),
  {},
);
const stationToTrainDictionary = dataGathered.reduce((stationDict, train) => {
  // For each stop in the train's schedule, add the train number.
  train.scheduleSrc.forEach((stop) => {
    // Use the station name as key.
    const station = stop.sta;
    // If the station is not in the dictionary, initialize it with an empty array.
    stationDict[station] = stationDict[station] || [];
    stationDict[station].push(train.trainNameSrc);
  });
  return stationDict;
}, {});

// Inspiration https://www.bahnreiseberichte.de/052-Ostsee/52-001Fahrplan-Konstanz-IC-Schwarzwald.JPG
function App() {
  const [search, setSearch] = React.useState("");
  const matchStationList = useFuzzySearchList({
    list: Object.keys(stationToTrainDictionary),
    queryText: search,
    // optional `getText` or `key`, same as with `createFuzzySearch`
    // getText: (item) => [item],
    mapResultItem: ({ item, score, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
    }),
  });

  const servicesRaw =
    search === ""
      ? []
      : matchStationList.flatMap(({ item: matchStation, highlightRanges }) =>
          _.uniq(stationToTrainDictionary[matchStation]).map((serviceName) => ({
            serviceName,
            matchStation,
            highlightRanges,
          })),
        );
  // console.log(servicesRaw);
  // return null;
  const services = servicesRaw
    .map(({ serviceName, matchStation, highlightRanges }) => {
      const {
        trainNameSrc: serviceId,
        operatorSrc: operator,
        scheduleSrc,
        runsSrc,
        commentsSrc,
      } = dataByTrain[serviceName] ?? {};
      // console.log(serviceName, ...scheduleSrc);
      const stationIndex = scheduleSrc.findIndex(
        (item) => item.sta === matchStation,
      );
      const { sta: station, dep } = scheduleSrc[stationIndex] ?? {};
      const { sta: destination, arr } = scheduleSrc.slice(-1)?.[0] ?? {};
      const intermediateSchedule = scheduleSrc
        // .slice(0, -1)
        .slice(stationIndex + 1, -1)
        .map(({ arr, sta }) => (arr ? `${sta} ${arr}` : `(${sta})`))
        .join(" — ");
      return {
        dep,
        serviceId,
        origin: scheduleSrc[0]?.sta,
        station,
        highlightRanges,
        operator,
        intermediateSchedule,
        destination,
        arr,
        runsSrc,
      };
    })
    .sort((a, b) => (a.dep > b.dep ? 1 : -1));
  // console.log("services", services);

  return (
    <div style={{ width: 800, textAlign: "left" }}>
      <Box padding={10} marginBottom={15}>
        Non zaude?
      </Box>
      <Box height={90} padding={10} marginBottom={15}>
        <input
          type="text"
          value={search}
          placeholder="Search..."
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
          style={{ fontSize: "inherit" }}
        />
        {matchStationList.map(({ item: matchStation, highlightRanges }, i) => (
          <div
            key={matchStation}
            onClick={() => setSearch(matchStation)}
            style={{ cursor: "pointer" }}
          >
            <Highlight text={matchStation} ranges={highlightRanges} />
          </div>
        ))}
      </Box>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "55px 95px 5fr",
          borderCollapse: "collapse",
          height: 350,
          overflowY: "auto",
          border: "1px solid gray",
        }}
      >
        {services.map(
          ({
            dep,
            serviceId,
            origin,
            station,
            highlightRanges,
            operator,
            intermediateSchedule,
            destination,
            arr,
            runsSrc,
          }) => {
            if (!dep) return null; // Only show departures
            return (
              <React.Fragment key={serviceId + station}>
                <Cell>
                  <strong>{dep}</strong>
                </Cell>
                <Cell>
                  <strong title={`${operator} from ${origin} ${runsSrc}`}>
                    {serviceId}
                  </strong>
                </Cell>
                <Cell>
                  <i>
                    <Highlight text={station} ranges={highlightRanges} /> —{" "}
                  </i>
                  {intermediateSchedule.length > 0
                    ? intermediateSchedule + " — "
                    : ""}
                  <strong>
                    {destination} {arr}
                  </strong>
                </Cell>
              </React.Fragment>
            );
          },
        )}
      </div>
    </div>
  );
}

export default App;

function Box({ children, ...styles }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
        border: "1px solid gray",
        ...styles,
      }}
    >
      {children}
    </div>
  );
}

function Cell({ children, ...styles }) {
  return (
    <span
      style={{
        padding: "3px 6px",
        borderBottom: "1px solid gray",
        ...styles,
      }}
    >
      {children}
    </span>
  );
}
