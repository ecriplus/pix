import { Parser } from '@json2csv/plainjs';

export function generateCSVTemplate(fields) {
  const json2csvParser = new Parser({
    withBOM: true,
    includeEmptyRows: false,
    fields,
    delimiter: ';',
  });
  return json2csvParser.parse([]);
}
