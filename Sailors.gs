function getAllActiveSailors(db) {
  var season = getCurrentSeason();
  var sailor_iter = db.query({type: "Sailor", active: true}).sortBy("last_name");
  var sailors = [];
  while (sailor_iter.hasNext()) {
    sailors.push(sailor_iter.next());
  }
  return sailors;
}

function sailorName(sailor) {
  return sailor.first_name + " " + sailor.last_name;
}

function sailNumber(sailor) {
  if (sailor.large_sail == sailor.small_sail) {
    return sailor.large_sail.toString();
  }
  return sailor.large_sail + "/" + sailor.small_sail;
}

function sailorNameAndSail(sailor) {
  return sailorName(sailor) + " (" + sailNumber(sailor) + ")";
}

function nextDivision(race, score) {
  var cur_division = score.division;
  var num_sailors = race["num_sailors_" + cur_division.toLowerCase()];
  if (num_sailors < 5) {
    return cur_division;
  }
  var bubble = Math.round(num_sailors * 0.2);
  if (cur_division == "A" && score.division_place > (num_sailors - bubble)) {
    return "B";
  }
  if (cur_division == "B" && score.division_place <= bubble) {
    return "A";
  }
  return cur_division;
}

function updateSailor(sailor, sailor_row) {
  if (sailor == null) {
    sailor = {type: "Sailor"};
  }
  sailor.first_name = sailor_row[1];
  sailor.last_name = sailor_row[2];
  sailor.email = sailor_row[3];
  sailor.starting_division = sailor_row[4];
  sailor.large_sail = sailor_row[5];
  sailor.small_sail = sailor_row[6];
  sailor.active = sailor_row[7] == "Y";
  return sailor;
}

function updateDivisions(db, sailors) {
  var season = getCurrentSeason();
  var races = db.query({
    type: "RaceDay",
    date: db.between(firstSeasonDay(season), firstSeasonDay(season+1)),
  }).sortBy("date", db.DESCENDING, db.NUMERIC);
  for each (var s in sailors) {
    s.sailor.regular_division = s.sailor.starting_division;
    for each (var div in ["a", "b"]) {
      s.sailor["num_races_" + div] = 0;
      s.sailor["score_" + div] = 0;
      s.sailor["denom_" + div] = 0;
    }
    s.sailor.rc_credits = 0;
    s.found_last_race = false;
  }    
  while (races.hasNext()) {
    var race = races.next();
    for each (var rc in race.rc_credit) {
      ++sailors[rc].sailor.rc_credits;
    }
    for each (var score in race.scores) {
      var s = sailors[score.sailor_id];
      var sailor = s.sailor;
      if (!race.is_regatta && !s.found_last_race) {
        sailor.regular_division = nextDivision(race, score);
        s.found_last_race = true;
      }
      var div = score.division.toLowerCase();
      var num_sailors = race["num_sailors_" + div];
      ++sailor["num_races_" + div];
      sailor["score_" + div] += CSScore(score.division_place, num_sailors);
      sailor["denom_" + div] += CSScore(1, num_sailors);
    }
  }
  for each (var s in sailors) {
    var sailor = s.sailor;
    if (sailor.num_races_a == sailor.num_races_b) {
      if (sailor.num_races_a == 0) {
        sailor.regatta_division = sailor.starting_division;
      } else {
        sailor.regatta_division = "Choice";
      }
    } else if (sailor.num_races_a > sailor.num_races_b) {
      sailor.regatta_division = "A";
    } else {
      sailor.regatta_division = "B";
    }
  }
}

function updateSailors() {
  var ss = SpreadsheetApp.getActiveSheet();
  if (ss.getName() != "Sailors") {
    return;
  }
  var db = ScriptDb.getMyDb();
  var numRows = ss.getLastRow()-1;
  // Ranges are 1 indexed.
  var range = ss.getRange(2, 1, numRows, 10);
  var data = range.getValues();
  var sailors = {}
  for (var i = 0; i < data.length; ++i) {
    var sailor = null;
    if (data[i][0] !== "") { 
      sailor = db.load(data[i][0]);
      if (sailor != null && data[i][9] == "DELETE") {
        db.remove(sailor);
        continue;
      }
    }
    sailor = db.save(updateSailor(sailor, data[i]));
    data[i][0] = sailor.getId();
    sailors[data[i][0]] = {sailor: sailor};
  }
  updateDivisions(db, sailors);
  for (var i = 0; i < data.length; ++i) {
    if (typeof sailors[data[i][0]] == "undefined") {
      date[i] = ["", "", "", "", "", "", "", "", "", ""];
      continue;
    } 
    var sailor = sailors[data[i][0]].sailor;
    // Override division assignment if required.
    if (data[i][8] == "A" || data[i][8] == "B") {
      sailor.regular_division = data[i][8];
      data[i][8] = "";
    }
    db.save(sailor);
  }
  range.setValues(data);
  range.sort([3, 2]);
}

function sortByDiv(a, b) {
  if (a.regular_division != b.regular_division) {
    if (a.regular_division < b.regular_division) {
      return -1;
    }
    return 1;
  }
  if (a.last_name != b.last_name) {
    if (a.last_name < b.last_name) {
      return -1;
    }
    return 1;
  }
  if (a.first_name != b.first_name) {
    if (a.first_name < b.firts_name) {
      return -1;
    }
    return 1;
  }
}

function updateDivisionAssignments() {
  var db = ScriptDb.getMyDb();
  var template = HtmlService.createTemplateFromFile("divisions");
  template.sailors = getAllActiveSailors(db);
  template.sailors.sort(sortByDiv);
  SitesApp.getPageByUrl(getWebsite() + "Division-Assignments").setHtmlContent(template.evaluate().getContent());
}
