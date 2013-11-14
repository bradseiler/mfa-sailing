function createScoringForm() {
  var db = ScriptDb.getMyDb();
  var app = UiApp.createApplication();
  var form = app.createFormPanel();
  
  var sailed_sep = app.createVerticalPanel()
  .add(perDivisionDetails(app, "Division A", "a"))
  .add(perDivisionDetails(app, "Division B", "b"))
  .setVisible(false);
  var sailed_tog = app.createVerticalPanel()
  .add(perDivisionDetails(app, "All Divisions", "tog"))
  .setVisible(false);
  var hidden_division = app.createTextBox().setName("div_sailed").setVisible(false);

  form
  .add(app.createVerticalPanel()
       .add(app.createHidden("type", "createScoringForm"))
       .add(app.createFlowPanel()
            .add(app.createInlineLabel("Date:"))
            .add(app.createDateBox().setName("date")))
       .add(app.createCheckBox("Regatta").setName("regatta"))
       .add(app.createFlowPanel()
            .add(app.createInlineLabel("Today the divisions sailed:"))
            .add(app.createRadioButton("division", "Separately").setName("div")
                 .addValueChangeHandler(app.createClientHandler()
                                        .forTargets(sailed_sep).setVisible(true)
                                        .forTargets(sailed_tog).setVisible(false)
                                        .forTargets(hidden_division).setText("Separately")))
            .add(app.createRadioButton("division", "Together").setName("div")
                 .addValueChangeHandler(app.createClientHandler()
                                        .forTargets(sailed_tog).setVisible(true)
                                        .forTargets(sailed_sep).setVisible(false)
                                        .forTargets(hidden_division).setText("Together")))
            .add(hidden_division))       
       .add(app.createFlowPanel()
            .add(app.createInlineLabel("Number of A Division Sailors:"))
            .add(app.createTextBox().setName("num_div_a")))
       .add(app.createFlowPanel()
            .add(app.createInlineLabel("Number of B Division Sailors:"))
            .add(app.createTextBox().setName("num_div_b")))
       .add(app.createFlowPanel()
            .add(app.createInlineLabel("Number of Guest Sailors:"))
            .add(app.createTextBox().setName("num_guests")))
       .add(sailed_sep)
       .add(sailed_tog)
       .add(app.createSubmitButton("Submit")));
  
  app.add(form);
  SpreadsheetApp.getActive().show(app);
}

function perDivisionDetails(app, division_label, suffix) {
  var hidden_size = app.createTextBox().setName("sail_size_" + suffix).setVisible(false);
  return app.createFlowPanel()
  .add(app.createLabel(division_label))
  .add(app.createFlowPanel()
       .add(app.createInlineLabel("Number of Races:"))
       .add(app.createTextBox().setName("num_races_" + suffix)))
  .add(app.createFlowPanel()
       .add(app.createInlineLabel("Sail Size:"))
       .add(app.createRadioButton("ss_" + suffix, "Large").setName("ss_" + suffix)
            .addValueChangeHandler(
              app.createClientHandler().forTargets(hidden_size).setText("Large")))
       .add(app.createRadioButton("ss_" + suffix, "Small").setName("ss_" + suffix)
            .addValueChangeHandler(
              app.createClientHandler().forTargets(hidden_size).setText("Small")))
       .add(hidden_size));
}  

function finishCreateScoringForm(eventInfo) {
  var app = UiApp.getActiveApplication();
  app.close();
  SpreadsheetApp.getActive().show(app);
  var race = {
    type: "RaceDay",
    date: dateToDateNum(new Date(eventInfo.parameter.date.replace("-","/", "g"))),
    is_regatta: eventInfo.parameter.regatta == "on",
    divs_sailed: eventInfo.parameter.div_sailed,
    num_sailors_a: parseInt(eventInfo.parameter.num_div_a),
    num_sailors_b: parseInt(eventInfo.parameter.num_div_b),
    num_sailors_guest: parseInt(eventInfo.parameter.num_guests),
  };
  for each (var div in ["a", "b"]) {
    for each (var prop in ["sail_size_", "num_races_"]) {
      if (race.divs_sailed == "Together") {
        race[prop + div] = eventInfo.parameter[prop + "tog"];
      } else {
        race[prop + div] = eventInfo.parameter[prop + div];
      }
    }
    race["num_races_" + div] = parseInt(race["num_races_" + div]);
  }
  var db = ScriptDb.getMyDb();
  race = db.save(race);
  var sheet = SpreadsheetApp.getActive().insertSheet(race.date.toString());
  buildScoringSheet(race, sheet).activate();
}             

function buildScoringSheet(race, sheet) {
  var num_sailors = race.num_sailors_a + race.num_sailors_b + race.num_sailors_guest;
  var row = 1;
  sheet.getRange(row, 1, 1, 2).setValues([["ID", race.getId()]]);
  sheet.getRange(++row, 1, 1, 2).setValues([["Date", dateNumToDate(race.date).toDateString()]]);
  sheet.getRange(++row, 1).setValue("RC Credit"); sheet.getRange(row, 2).setBackground("yellow");
  sheet.getRange(++row, 1).setValue("RC IDs");
  ++row;
  sheet.getRange(++row, 1, 1, 2).setValues([["Divisions Sailed", race.divs_sailed]]);
  sheet.getRange(++row, 1, 1, 2).setValues([["Is Regatta", race.is_regatta ? "Yes" : "No"]]);
  sheet.getRange(++row, 1, 1, 6).setValues([["A Sailors", race.num_sailors_a, "A Races", race.num_races_a, "A Sails", race.sail_size_a]]);
  sheet.getRange(++row, 1, 1, 6).setValues([["B Sailors", race.num_sailors_b, "B Races", race.num_races_b, "B Sails", race.sail_size_b]]);
  sheet.getRange(++row, 1, 1, 2).setValues([["Guest Sailors", race.num_sailors_guest]]);
  if (race.divs_sailed == "Together") {
    addScoreHeader(sheet, ++row, parseInt(race.num_races_a));
    sheet.getRange(row+1, 2, num_sailors, 3 + race.num_races_a).setBackground("yellow");
    for (var i = 0; i < race.num_sailors_a; i++) {
      sheet.getRange(++row, 4, 1, 1).setValue("A");
    }
    for (var i = 0; i < race.num_sailors_b; i++) {
      sheet.getRange(++row, 4, 1, 1).setValue("B");
    }
    for (var i = 0; i < race.num_sailors_guest; i++) {
      sheet.getRange(++row, 4, 1, 1).setValue("G");
    }
  } else {
    sheet.getRange(++row, 1).setValue("A Division");
    addScoreHeader(sheet, ++row, parseInt(race.num_races_a));
    sheet.getRange(row+1, 2, race.num_sailors_a, 3 + race.num_races_a).setBackground("yellow");
    for (var i = 0; i < race.num_sailors_a; i++) {
      sheet.getRange(++row, 4, 1, 1).setValue("A");
    }
    sheet.getRange(++row, 1).setValue("B Division");
    addScoreHeader(sheet, ++row, parseInt(race.num_races_b));
    sheet.getRange(row+1, 2, race.num_sailors_b + race.num_sailors_guest, 3 + race.num_races_b).setBackground("yellow");
    for (var i = 0; i < race.num_sailors_b; i++) {
      sheet.getRange(++row, 4, 1, 1).setValue("B");
    }
    for (var i = 0; i < race.num_sailors_guest; i++) {
      sheet.getRange(++row, 4, 1, 1).setValue("G");
    }
  }
  for (var c = 3; c <= 10; ++c) {
    sheet.setColumnWidth(c, 50);
  }
  return sheet;
}

function addScoreHeader(sheet, row, num_races) {
  var race_labels = new Array(num_races);
  for (var i = 0; i < num_races; i++) {
    race_labels[i] = "R" + (i + 1);
  }
  var header = ["Sailor ID", "Sailor Name", "Sail #", "Division"].concat(race_labels);
  sheet.getRange(row, 1, 1, 4 + num_races).setValues([header]);
}

function populateSailorIDs() {
  var db = ScriptDb.getMyDb();
  var sheet = SpreadsheetApp.getActiveSheet();
  var race = db.load(sheet.getRange(1,2).getValue());
  if (race == null) {
    Logger.log("Race not found.");
    return;
  }
  var sailors = getAllActiveSailors(db);
  for each (var s in sailors) {
    s.full_name = sailorName(s);
    s.full_name_lower = s.full_name.toLowerCase();
  }
  // Populate RC
  populateIDsForRange(
    sailors,
    function(i) { return sheet.getRange(3, 2 + i); },
    function(i) { return sheet.getRange(4, 2 + i); });
  // Populate A division (or single division).
  var startingADiv = race.divs_sailed == "Together" ? 12 : 13; 
  var numSailorsA = race.divs_sailed == "Together" ? race.num_sailors_a + race.num_sailors_b : race.num_sailors_a;
  populateIDsForRange(
    sailors,
    function(i) { return sheet.getRange(startingADiv + i, 2); },
    function(i) { return sheet.getRange(startingADiv + i, 1); },
    numSailorsA,
    function(i) { return sheet.getRange(startingADiv + i, 3); },
    race.sail_size_a);
  if (race.divs_sailed == "Separately") {
    var startingBDiv = startingADiv + numSailorsA + 2;
    populateIDsForRange(
      sailors,
      function(i) { return sheet.getRange(startingBDiv + i, 2); },
      function(i) { return sheet.getRange(startingBDiv + i, 1); },
      race.num_sailors_b,
      function(i) { return sheet.getRange(startingBDiv + i, 3); },
      race.sail_size_b);
  }
  db.save(race);
}

function populateIDsForRange(sailors, getSailorCell, getIDCell, num, getSailNumCell, sailSize) {
  var ret = [];
  var sailString = sailSize !== undefined ? sailSize.toLowerCase() + "_sail" : "";
  for (var i = 0; typeof num == "undefined" || i < num; ++i) {
    if (typeof num == "undefined" && getSailorCell(i).getValue() == "") {
      break;
    }
    if (getIDCell(i).getValue() != "") {
      continue;
    }
    var sailorStrings = getSailorCell(i).getValue().toLowerCase().split(" ");
    var match = null;
    for each (var s in sailors) {
      var foundAll = true;
      for each (var str in sailorStrings) {
        if (s.full_name_lower.indexOf(str) === -1) {
          foundAll = false;
          break;
        }
      }
      if (foundAll) {
        if (match !== null) {
          getSailorCell(i).setBackground("red");
          match = null;
          break;
        }
        match = s;
      }
    }
    if (match !== null) {
      ret.push(match.getId())
      getIDCell(i).setValue(match.getId());
      getSailorCell(i).setBackground("white").setValue(match.full_name);
      if (typeof getSailNumCell != "undefined") {
        getSailNumCell(i).setValue(match[sailString]).setBackground("white");
      }
    }
  }
  return ret;
}

function saveRaceForm() {
  var db = ScriptDb.getMyDb();
  var sheet = SpreadsheetApp.getActiveSheet();
  var race = db.load(sheet.getRange(1,2).getValue());
  if (race == null) {
    Logger.log("Race not found.");
    return;
  }
  race.rc_credit = [];
  var c = 2;
  var rc_id = sheet.getRange(4,c).getValue()
  while(rc_id != "") {
    race.rc_credit.push(rc_id);
    rc_id = sheet.getRange(4,++c).getValue();
  }
  race.divs_sailed = sheet.getRange(6, 2).getValue();
  race.is_regatta = sheet.getRange(7, 2).getValue() == "Yes";
  var race_stats_row = 8;
  for each (var div in ["a", "b"]) {
    race["num_sailors_" + div] = parseInt(sheet.getRange(race_stats_row,2).getValue());
    race["num_races_" + div] = parseInt(sheet.getRange(race_stats_row,4).getValue());
    race["sail_size_" + div] = sheet.getRange(race_stats_row,6).getValue();
    ++race_stats_row;
  }
  race.num_sailors_guest = parseInt(sheet.getRange(race_stats_row,2).getValue());
    
  race.scores = [];
  function saveScoresToRace(startRow, numRows, numRaces) {
    for (var row = startRow; row < startRow + numRows; ++row) {
      var score = {
        sailor_id: sheet.getRange(row, 1).getValue(),
        division: sheet.getRange(row, 4).setBackground("white").getValue(),
        sail_num: sheet.getRange(row, 3).getValue(),
        points: sheet.getRange(row, 5, 1, numRaces).setBackground("white").getValues()[0],
      };
      score.total = 0;
      for each (var p in score.points) {
        if (isNaN(p)) {
          score.total += numRows + 1;
        } else {
          score.total += parseFloat(p);
        }
      }
      race.scores.push(score);
    }
  }
  // Score A division (or single division).
  var startingADiv = race.divs_sailed == "Together" ? 12 : 13; 
  var numSailorsA = race.divs_sailed == "Together" ? race.num_sailors_a + race.num_sailors_b + race.num_sailors_guest : race.num_sailors_a;
  saveScoresToRace(startingADiv, numSailorsA, race.num_races_a);
  if (race.divs_sailed == "Separately") {
    var startingBDiv = startingADiv + numSailorsA + 2;
    saveScoresToRace(startingBDiv, race.num_sailors_b + race.num_sailors_guest, race.num_races_b);
  }
  scoreRace(race);
  db.save(race);
  postRace(race);
}

function comparePoints(race) {
  return function(score_a, score_b) {
    var num_starters = 0;
    if (race.divs_sailed == "Separately") {
      if (score_a.division == "A") {
        if (score_b.division != "A") {
          return -1;
        }
        num_starters = race.num_sailors_a;
      } else {
        if (score_b.division == "A") {
          return 1;
        }
        num_starters = race.num_sailors_b + race.num_sailors_guest;
      }
    } else {
      num_starters = race.num_sailors_a + race.num_sailors_b + race.num_sailors_guest;
    }
    function parsePoints(p) {
      var ret = parseFloat(p);
      if (isNaN(ret)) {
        return num_starters + 1;
      }
      return ret;
    }
    if (score_a.total != score_b.total) {
      return score_a.total - score_b.total;
    }
    var pa = score_a.points.map(parsePoints);
    var pb = score_b.points.map(parsePoints);
    var pa_sorted = pa.slice().sort(function(a,b) { return a-b; });
    var pb_sorted = pb.slice().sort(function(a,b) { return a-b; });
    for (var i = 0; i < pa_sorted.length; i++) {
      if (pa_sorted[i] != pb_sorted[i]) {
        Logger.log(pa_sorted);
        Logger.log(pb_sorted);
        return pa_sorted[i] - pb_sorted[i];
      }
    }
    for (var i = pa.length - 1; i >= 0; i--) {
      if (pa[i] != pb[i]) {
        Logger.log(pa_sorted);
        Logger.log(pb_sorted);
        Logger.log(pa);
        Logger.log(pb);
        return pa[i] - pb[i];
      }
    }
    return 0;
  };
}
  
function scoreRace(race) {
  var compareFun = comparePoints(race);
  race.scores.sort(compareFun);
  var place_tracker = {
    A: {
      next: 1, 
      last: null,
    },
    B: {
      next: 1,
      last: null,
    },
  }
  var last_score = null;
  for (var i = 0; i < race.scores.length; ++i) {
    var cur_score = race.scores[i];
    if (last_score != null && compareFun(last_score, cur_score) == 0) {
      race.scores[i].overall_place = last_score.overall_place;
    } else {
      race.scores[i].overall_place = i + 1;
    }
    last_score = cur_score;
    if (typeof place_tracker[cur_score.division] !== "undefined") {
      var last_in_div = place_tracker[cur_score.division].last
      if (last_in_div != null && compareFun(last_in_div, cur_score) == 0) {
        race.scores[i].division_place = last_in_div.division_place;
      } else {
        race.scores[i].division_place = place_tracker[cur_score.division].next;
      }
      place_tracker[cur_score.division].last = cur_score;
      ++place_tracker[cur_score.division].next;
    }
  }
}

function deleteRaceForm() {
  var db = ScriptDb.getMyDb();
  var sheet = SpreadsheetApp.getActiveSheet();
  var race = db.load(sheet.getRange(1,2).getValue());
  if (race == null) {
    Logger.log("Race not found.");
    return;
  }
  db.remove(race);
  sheet.getParent().deleteSheet(sheet);
}

function dailyScoresPage() {
  var season = getCurrentSeason();
  var name = season + "-" + (season + 1) + "-daily-scores";
  return SitesApp.getPageByUrl(getWebsite() + name);
}  

function postRace(race) {
  var scores_page = dailyScoresPage();
  var db = ScriptDb.getMyDb();
  var template = HtmlService.createTemplateFromFile("race");
  template.race = race;
  template.db = db;
  var content = template.evaluate().getContent();
  var page = scores_page.getChildByName(race.date);
  if (page == null) {
    scores_page.createWebPage("Race - " + dateNumToDate(race.date).toDateString(), race.date, content);
  } else {
    page.setHtmlContent(content);
  }
}

function updateDailyScores() {
  var template = HtmlService.createTemplateFromFile("daily-scores");
  template.scores_page = dailyScoresPage();
  var db = ScriptDb.getMyDb();
  var season = getCurrentSeason();
  template.races = db.query({
    type: "RaceDay",
    date: db.between(firstSeasonDay(season), firstSeasonDay(season+1)),
  }).sortBy("date", db.ASCENDING, db.NUMERIC);
  template.scores_page.setHtmlContent(template.evaluate().getContent());
}
  
