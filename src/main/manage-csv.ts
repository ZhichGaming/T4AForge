import { parse } from 'csv-parse';
import fs from 'fs';

export async function getCSV(path: string) {
  const records = [];
  const parser = fs
    .createReadStream(path)
    .pipe(parse());

  for await (const record of parser) {
    records.push(record);
  }

  return records;
}
