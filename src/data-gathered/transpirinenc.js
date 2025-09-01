import { format, parse, addMinutes } from "date-fns";

const STATIONS = [
    "Martorell Central",
    "Castellbisbal",
    "Rubí Can Vallhonrat",
    "Sant Cugat Coll Favà",
    "Cerdanyola Universitat",
    "Santa Perpètua de Mogoda Riera de Caldes",
    "Mollet Sant Fost",
    "Montmeló",
    "Granollers Centre",
];

function createRun(hhmm, stations, runTimes) {
    const srcDepTime = parse(hhmm, "HH:mm", new Date());
    return stations.map((sta, i) => {
        const minsAcc = runTimes.slice(0, i).reduce((acc, d) => acc + d, 0);
        const tFormatted = format(addMinutes(srcDepTime, minsAcc), "HH:mm");
        return {
            sta,
            dep: i < stations.length - 1 ? tFormatted : undefined,
            arr: i > 0 ? tFormatted : undefined,
        };
    });
}

export default [
    // De Martorell a Granollers
    ...[
        "6:23",
        "7:23",
        "8:23",
        "9:23",
        "10:23",
        "11:23",
        "12:23",
        "13:23",
        "14:23",
        "15:23",
        "16:23",
        "17:23",
        "18:23",
        "19:23",
        "20:23",
        "21:23",
    ].map((dep) => ({
        trainNameSrc: "R8/M" + dep.substring(0, 1),
        operatorSrc: "Renfe",
        scheduleSrc: createRun(dep, STATIONS, [6, 12, 3, 5, 5, 7, 3, 6]),
        validity: ["20250101", "20251231"],
    })),
    // De Granollers a Martorell
    ...[
        "6:32",
        "7:32",
        "8:32",
        "9:32",
        "10:32",
        "11:32",
        "12:32",
        "13:32",
        "14:32",
        "15:32",
        "16:32",
        "17:32",
        "18:32",
        "19:32",
        "20:32",
        "21:32",
    ].map((dep) => ({
        trainNameSrc: "R8/G" + dep.substring(0, 1),
        operatorSrc: "Renfe",
        scheduleSrc: createRun(
            dep,
            STATIONS.reverse(),
            [5, 3, 4, 6, 3, 4, 10, 6],
        ),
        validity: ["20250101", "20251231"],
    })),
];
