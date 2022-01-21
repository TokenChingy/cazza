/**
 * Dependencies
 */

import { JSONFile, Low } from "lowdb";

import _ from "lodash";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

/**
 * Database
 */

const dbFile = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "db.json"
);
const dbAdapter = new JSONFile(dbFile);
const db = new Low(dbAdapter);

await db.read();
db.data ||= { submissions: [] };
db.chain = _.chain(db.data);

/**
 * Server
 */

const app = express();
const host = "0.0.0.0";
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/submissions", async function (request, response) {
  for await (const person of request.body) {
    const personExists = db.chain.get("submissions").find(person).value();

    if (personExists === undefined) {
      db.chain.get("submissions").push(person).value();
      await db.write();
    }
  }

  response.status(200);
  response.end();
});

app.listen(port, host, function () {
  console.log(`Listening at http://${host}:${port}`);
});
