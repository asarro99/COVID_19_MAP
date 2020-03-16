const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3000;

const adapter = new FileSync("covid-19.json");
const db = low(adapter);

db.defaults({ cPoints: [] }).write();

app.get("/", (req, res) => res.json(db.get("cPoints").value()));
app.listen(port, () => console.log(`Ascolto sulla porta: ${port}`));
