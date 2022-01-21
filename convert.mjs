import converter from "json-2-csv";
import fs from "fs";

const jsonData = JSON.parse(fs.readFileSync("db.json", "utf-8"));

converter.json2csv(jsonData.submissions, (error, csv) => {
  if (error) {
    throw error;
  }

  // write CSV to a file
  fs.writeFileSync("submissions.csv", csv);
});
