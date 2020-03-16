const fetch = require("node-fetch");
const parse = require("csv-parse/lib/sync");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { CPoint } = require("../lib/CPoint");

const COVID_19_URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";

const adapter = new FileSync("covid-19.json");
const db = low(adapter);

db.defaults({ cPoints: [] }).write();

const main = async () => {
  const dataRaw = await fetch(COVID_19_URL).then(res => res.text());
  const records = parse(dataRaw, {
    columns: true,
    skip_empty_lines: true
  });

  db.get("cPoint")
    .remove()
    .write();

  records
    .map(record => CPoint.FromCSVRecord(record))
    .map(cPoint =>
      db
        .get("cPoints")
        .push(cPoint)
        .write()
    );
};

main();
