function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.addMenu("Publish",
             [{name: "All", functionName: "publishAll"},
              {name: "Update Sailors", functionName: "updateSailors"},
              {name: "Update Divisions", functionName: "updateDivisionAssignments"},
              {name: "Update Standings", functionName: "updateStandings"},
              {name: "Update Daily Scores", functionName: "updateDailyScores"}]);
  ss.addMenu("Races",
             [{name: "New",
               functionName: "createScoringForm"},
              {name: "Populate IDs",
               functionName: "populateSailorIDs"},
              {name: "Save",
               functionName: "saveRaceForm"}]);
}

function publishAll() {
  updateSailors();
  updateDivisionAssignments();
  updateStandings();
  updateDailyScores();
}
