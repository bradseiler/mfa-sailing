function logEverything() {
  var db = ScriptDb.getMyDb();
  var l = db.query({});
  while (l.hasNext()) {
    var next = l.next();
    Logger.log(next.type + ": " + next.toJson());
  }
}

function testAddScoreHeader() {
  var testSheet = {
    getRange: function(row, col, nrows, ncols) {
      var testRange = {
        setValues: function(vals) {
          Logger.log(vals);
        }
      };
      return testRange;
    }
  };
  addScoreHeader(testSheet, 1, 10);
}

function testBuildScoringSheet() {
  var testRaceSep = {
    getId: function() { return "TestID"; },
    type: "Race Day",
    date: "20131027",
    divs_sailed: "Separately",
    num_sailors_a: 10,
    num_sailors_b: 6,
    num_sailors_guest: 2,
    num_races_a: 7,
    num_races_b: 6,
    sail_size_a: "Large",
    sail_size_b: "Small",
  };
  var testSheet = {
    getRange: function(row, col, nrows, ncols) {
      Logger.log([row, col, nrows, ncols]);
      var testRange = {
        setValue: function(val) {
          Logger.log("setValue: " + val);
          return this;
        },
        setValues: function(vals) {
          Logger.log("setValues: " + vals);
          return this;
        },
        setBackground: function(color) {
          Logger.log("setBackground: " + color);
          return this;
        },
      };
      return testRange;
    }
  };
  buildScoringSheet(testRaceSep, testSheet)
}

function testPopulateIDsForRange() {
  var sailors = [
    {
      getId: function() { return "S1"; },
      full_name: "John Doe",
      full_name_lower: "john doe",
      large_sail: 10,
      small_sail: 20,
    },
    {
      getId: function() { return "S2"; },
      full_name: "Jane Doe",
      full_name_lower: "jane doe",
      large_sail: 15,
      small_sail: 25,
    }];
  var sailorCells = ["jo", "jane", "john.d", "Doe", "tim", ""];
  function getSailorCell(i) {
    var testCell = {
      getValue: function() { return sailorCells[i]; },
      setValue: function(val) {
        Logger.log("set sailor cell: " + i + ", " + val);
        return this;
      },
      setBackground: function(color) {
        Logger.log("setBackground: " + i + ", " + color);
        return this;
      },
    };
    return testCell;
  }
  function getIDCell(i) {
    var testCell = {
      setValue: function(val) {
        Logger.log("set ID cell: " + i + ", " + val);
      },
    };
    return testCell;
  }
  function getSailNumCell(i) {
    var testCell = {
      setValue: function(val) {
        Logger.log("set sail num cell: " + i + ", " + val);
      },
    };
    return testCell;
  }
  
  populateIDsForRange(sailors, getSailorCell, getIDCell);
  populateIDsForRange(sailors, getSailorCell, getIDCell, 2, getSailNumCell, "Large");
  populateIDsForRange(sailors, getSailorCell, getIDCell, 2, getSailNumCell, "Small");
}

function testDateConv() {
  Logger.log(dateNumToDate(20130106).toDateString());
  Logger.log(dateToDateNum(new Date(2013, 0, 6)).toString());
  Logger.log((new Date("2013/01/06")).toDateString());
  Logger.log(dateToDateNum(new Date("2013/01/06")));
}
