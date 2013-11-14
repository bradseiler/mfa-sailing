function doPost(eventInfo) {
  if (eventInfo.parameter.type == "createScoringForm") {
    finishCreateScoringForm(eventInfo);
  }
}
