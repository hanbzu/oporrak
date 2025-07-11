
Reference: https://docs.google.com/spreadsheets/d/11kivRw_TpBDqP_eM0MLtOHNz84zKFytLz781nwgIXIo/edit?gid=1718019165#gid=1718019165

```json
{ "suggestions": [{ "object_0":"identifiedByexternalID=9007·19____·x", "extId":"9007·19____·x", "name":"EST 9007", "administration":"19____", "direction":"x", "idJrnyId":"identifiedByjourneyID=EST 9007:Paris Nord Eurostar:08.03.2025:07:09", "journeyID":"EST 9007:Paris Nord Eurostar:08.03.2025:07:09", "id":"529178", "cycle":"0", "pool":"81", "value":"9007", "type":"EST", "trainClass":"1", "line":"identifiedByexternalID=9007·19____·x", "locations":[ {"name":"Paris Nord Eurostar","x":"2354598","y":"48880697","evaId":"8798014","depTime":"07:09","arrTime":"","depDate":"08.03.2025","arrDate":""} , {"name":"London St. Pancras International","x":"-126361","y":"51531922","evaId":"7004428","depTime":"","arrTime":"08:30","depDate":"","arrDate":"08.03.2025"} ], "dep":"Paris Nord Eurostar", "arr":"London St. Pancras International", "depEva":"8798014", "arrEva":"7004428", "depTime":"07:09", "arrTime":"08:30", "pubTime":"18:47", "summary":"EST 9007, Paris Nord Eurostar (07:09) - London St. Pancras International (08:30)", "expand1":"1&memVal_0_sourceStationName_0=Paris Nord Eurostar&memVal_0_sourceStationEvaID_0=8798014&memVal_0_sourceStationDep_0=08.03.2025 07:09&memVal_0_sourceStationCoord_0_x=2354598e-6&memVal_0_sourceStationCoord_0_y=48880697e-6&memVal_0_timeFrom_0=07:09", "expand2":"1&memVal_0_targetStationName_0=London St. Pancras International&memVal_0_targetStationEvaID_0=7004428&memVal_0_targetStationDep_0=08.03.2025 08:30&memVal_0_targetStationCoord_0_x=-126361e-6&memVal_0_targetStationCoord_0_y=51531922e-6&memVal_0_timeTo_0=08:30", "valPeriodBegDate_0":"08.03.2025", "valPeriodEndDate_0":"08.03.2025", "pubPeriodBegDate_0":"08.03.2025", "pubPeriodEndDate_0":"08.03.2025", "referenceJourney":"identifiedByjourneyID=EST 9007:Paris Nord Eurostar:08.03.2025:07:09", "journeys_0":"identifiedByjourneyID=EST 9007:Paris Nord Eurostar:08.03.2025:07:09", "trainLines_0":"identifiedByexternalID=9007·19____·x", "trainType_0":"EST" }]}
```

Workflow:
1. Old ÖBB Scotty. Manually search connection. Use bookmarklet.
2. Get all the train links in the page (maybe go to next pages or warn that there may be more pages).
3. For one train link get all train information parsed.
  3.1 Train link > remove search params https://fahrplan.oebb.at/bin/traininfo.exe/en/963534/485395/813686/85665/81?protocol=https:&seqnr=7&ident=ic.060017145.1742924642&date=25.03.2025&station_evaId=8700011&station_type=dep&station_time=18:55&input=8798014&boardType=dep&time=18:51&maxJourneys=20&dateBegin=&dateEnd=&selectDate=&productsFilter=1011111111011&dirInput=&backLink=sq&
  3.2 Though it's very likely that these numbers correspond to temporary session numbers and cannot be reused in the future
  3.3 Add JSON modifier https://fahrplan.oebb.at/bin/traininfo.exe/en/963534/485395/813686/85665/81?L=vs_json.vs_hap
  3.4 Turn the JSON output into a more compact oporrak-friendly train identifier.

  Unfortunatly the JSON output does not return days of operation which is central.

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

A friendly service identifier:
station_code_format|stops|runDays_weekmasks|runDays_also|runDays_not
uic|8011162.d10:30,8002549.a11:15.d11:20,8000261.a12:00|20250311-20260311.1111100,20260312-20260501.1110100|20260505,20260607|20250311

This service identifier acts as a service code. If there's a train with a different stop pattern it should be registered as a different service code.
Then metadata can be stored under this key. For example the operating company or the train name.

Actually it may be interesting to store the running conditions as metadata. This way we could manually enter a schedule even when we don't have the full run days data.

It would be very cool to log all retrievals and randomly validate the algorithm for failures.

```json
{
  "suggestions": [
    {
      "object_0": "identifiedByexternalID=2377·87____·x",
      "extId": "2377·87____·x",
      "name": "TGV 2377",
      "administration": "87____",
      "direction": "x",
      "idJrnyId": "identifiedByjourneyID=TGV 2377:Paris Est:25.03.2025:18:55",
      "journeyID": "TGV 2377:Paris Est:25.03.2025:18:55",
      "id": "164217",
      "cycle": "0",
      "pool": "81",
      "value": "2377",
      "type": "TGD",
      "trainClass": "1",
      "line": "identifiedByexternalID=2377·87____·x",
      "locations": [
        {
          "name": "Paris Est",
          "x": "2359120",
          "y": "48876976",
          "evaId": "8700011",
          "depTime": "18:55",
          "arrTime": "",
          "depDate": "25.03.2025",
          "arrDate": ""
        },
        {
          "name": "Strasbourg",
          "x": "7734067",
          "y": "48585339",
          "evaId": "8700023",
          "depTime": "20:47",
          "arrTime": "20:40",
          "depDate": "",
          "arrDate": ""
        },
        {
          "name": "Sélestat",
          "x": "7443041",
          "y": "48260298",
          "evaId": "8700179",
          "depTime": "21:09",
          "arrTime": "21:06",
          "depDate": "",
          "arrDate": ""
        },
        {
          "name": "Colmar",
          "x": "7346542",
          "y": "48072477",
          "evaId": "8700178",
          "depTime": "",
          "arrTime": "21:20",
          "depDate": "",
          "arrDate": "25.03.2025"
        }
      ],
      "dep": "Paris Est",
      "arr": "Colmar",
      "depEva": "8700011",
      "arrEva": "8700178",
      "depTime": "18:55",
      "arrTime": "21:20",
      "pubTime": "19:01",
      "summary": "TGV 2377, Paris Est (18:55) - Colmar (21:20)",
      "expand1": "1&memVal_0_sourceStationName_0=Paris Est&memVal_0_sourceStationEvaID_0=8700011&memVal_0_sourceStationDep_0=25.03.2025 18:55&memVal_0_sourceStationCoord_0_x=2359120e-6&memVal_0_sourceStationCoord_0_y=48876976e-6&memVal_0_timeFrom_0=18:55",
      "expand2": "1&memVal_0_targetStationName_0=Colmar&memVal_0_targetStationEvaID_0=8700178&memVal_0_targetStationDep_0=25.03.2025 21:20&memVal_0_targetStationCoord_0_x=7346542e-6&memVal_0_targetStationCoord_0_y=48072477e-6&memVal_0_timeTo_0=21:20",
      "valPeriodBegDate_0": "25.03.2025",
      "valPeriodEndDate_0": "25.03.2025",
      "pubPeriodBegDate_0": "25.03.2025",
      "pubPeriodEndDate_0": "25.03.2025",
      "referenceJourney": "identifiedByjourneyID=TGV 2377:Paris Est:25.03.2025:18:55",
      "journeys_0": "identifiedByjourneyID=TGV 2377:Paris Est:25.03.2025:18:55",
      "trainLines_0": "identifiedByexternalID=2377·87____·x",
      "trainType_0": "TGD"
    }
  ]
}
```


I want a javascript function that takes a string describing when a train runs and returns the information in a structured format with the following fields:
- period: Optional, with format ["YYYYMMDD", "YYYYMMDD"] where the validity range is specified
- pattern: Optional, with format "0000011" the 0s and 1s represent days of the week starting from Monday. This amends negativelly the validity range.
- also: amends the previous entry including exta days of operation in the format of array of either "YYYYMMDD" dates or ["YYYYMMDD", "YYYYMMDD"] periods.
- not: amends all the previous entries by removing the specified days of operation in the format of either "YYYYMMDD" dates or ["YYYYMMDD", "YYYYMMDD"] periods.

I'll now give you test cases:

- input: "runs 8. Mar until 19. Apr 2025 Sa; also 9. Mar, 16. until 20. Mar 2025, 23. Mar, 7. until 11. Apr 2025, 14., 18. Apr"
- output: {
    period: ["20250308", "20250419"],
    pattern: "0000010",
    also: ["20250309", ["20250316", "20250320"], "20250323", ["20250407", "20250411"], "20250414", "20250418"],
  }

- input: "runs 8. Mar until 20. Apr 2025 Sa, Su"
- output: {
    period: ["20250308", "20250420"]
    pattern: "0000011",
  }

- input: "runs 16. Dec 2024 until 11. Apr 2025 Mo - Fr; not 25. Dec, 1. Jan, 14., 17., 21., 24. Feb"
- output: {
    period: ["20241216", "20250411"],
    pattern: "1111100",
    not: ["20241225", "20250101", "20250214", "20250217", "20250221", "20250224"],
  }

- input: "runs 26. until 28. Mar 2025"
- output: {
    period: ["20250326", "20250328"],
  }

- input: "runs daily, not 31. Mar until 25. Apr 2025, 12. May until 5. Jun 2025, 22. until 26. Sep 2025, 9. until 15. Nov 2025"
- output: {
    pattern: "1111111",
    not: [["20250331", "20250425"], ["20250512", "20250605"], ["20250922", "20250926"], ["20251109", "20251115"]]
  }

- input: "runs daily, not 31. Mar until 25. Apr 2025, 12. May until 5. Jun 2025, 22. until 26. Sep 2025, 9. until 15. Nov 2025"
- output: {
    pattern: "1111111",
    not: [["20250331", "20250425"], ["20250512", "20250605"], ["20250922", "20250926"], ["20251109", "20251115"]]
  }


OK, I'll stop here.
I need to change how the yearDict operates to keep track of the year and the month, then change again the dayParse to have a default year.
I also need to finish the gridParse method. With that I'm ready to start building the DB!!!

Tips when making bookmarklets:
- Use this https://mrcoles.com/bookmarklet/
- Remove any "//" type comments, they will make the parser fail
- If copying to the clipboard fails try clicking the back of the page first
