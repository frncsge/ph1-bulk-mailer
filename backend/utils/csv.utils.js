import { parse } from "csv-parse";

export const parseCsvBuffer = async (buffer) => {
  return new Promise((resolve, reject) => {
    // array to store parsed csv (array of objects)
    const records = [];

    // create csv parser
    const parser = parse({ columns: true });

    // set the parser event listeners
    // readable: called whenever parser has rows ready to read
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    // error: called if an error occurs
    parser.on("error", (error) => reject(error));
    // end: called when parser finished reading all the rows
    parser.on("end", () => resolve(records));

    // pass the buffer to the csv parser and signal the end of input
    parser.write(buffer);
    parser.end();
  });
};
