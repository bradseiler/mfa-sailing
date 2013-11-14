function scoreSort(div) {
  return function(a, b) {
    return b["score_" + div] / b["denom_" + div] - a["score_" + div] / a["denom_" + div];
  };
}

function updateStandings() {
  var db = ScriptDb.getMyDb();
  var template = HtmlService.createTemplateFromFile("standings");
  var all_sailors = getAllActiveSailors(db);
  template.sailors = {
    a: all_sailors.filter(function(s) { return s.num_races_a > 0; }).sort(scoreSort("a")),
    b: all_sailors.filter(function(s) { return s.num_races_b > 0; }).sort(scoreSort("b")),
  }
  var season = getCurrentSeason();
  var season_scores_page = season + "-" + (season + 1) + "-season-scores";
  SitesApp.getPageByUrl(getWebsite() + season_scores_page)
  .setHtmlContent(template.evaluate().getContent());
}
