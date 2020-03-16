const moment = require("moment");
class CPoint {
  constructor(name, state, lat, lon) {
    this.name = name;
    this.state = state;
    this.place = { lat, lon };
    this.cases = [];
  }
  static FromCSVRecord(record) {
    let cPoint = new CPoint(
      record["Province/State"],
      record["Country/Region"],
      record.Lat,
      record.Long
    );
    let current = moment("2020-01-22");

    while (current.isBefore(moment(), "day")) {
      current.format("M/D/YY");
      cPoint.cases.push({
        n: record[current.format("M/D/YY")],
        when: current.format()
      });
      current.add(1, "days");
    }

    return cPoint;
  }
}

module.exports = {
  CPoint
};
