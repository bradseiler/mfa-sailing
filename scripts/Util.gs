function firstSeasonDay(season) {
  return parseInt(season + "0701");
}

function getCurrentSeason() {
  return 2013;
}

function getWebsite() {
  return "https://sites.google.com/your-score-site";
}

function dateNumToDate(dn) {
  var year = Math.floor(dn / 10000);
  var month = Math.floor(dn / 100) % 100 - 1;
  var day = dn % 100;
  return new Date(year, month, day);
}

function dateToDateNum(date) {
  return Math.floor(date.getUTCFullYear()*10000 + (date.getUTCMonth() + 1)*100 + date.getUTCDate());
}
