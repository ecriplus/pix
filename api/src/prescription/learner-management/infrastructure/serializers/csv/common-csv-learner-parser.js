import iconv from 'iconv-lite';
import papa from 'papaparse';

import { CsvImportError } from '../../../../../shared/domain/errors.js';

const ERRORS = {
  ENCODING_NOT_SUPPORTED: 'ENCODING_NOT_SUPPORTED',
  BAD_CSV_FORMAT: 'BAD_CSV_FORMAT',
  HEADER_REQUIRED: 'HEADER_REQUIRED',
  HEADER_UNKNOWN: 'HEADER_UNKNOWN',
};

const PARSING_OPTIONS = {
  header: true,
  skipEmptyLines: 'greedy',
  transform: (value) => {
    if (typeof value === 'string') {
      value = value.trim();
      return value.length ? value : undefined;
    }
    return value;
  },
};

class CommonCsvLearnerParser {
  #input;
  #errors;

  // compute heading
  #columns;
  // compute support_enconding
  #supportedEncodings;

  constructor(input, headingConfiguration, encodingConfiguration) {
    this.#input = input;
    this.#errors = [];

    // compute heading
    this.#columns = headingConfiguration;

    // compute support_enconding
    this.#supportedEncodings = encodingConfiguration;
  }

  parse(encoding) {
    const { learnerLines, fields } = this.#parse(encoding);

    this.#throwHasErrors();

    this.#checkColumns(fields);

    this.#throwHasErrors();

    return learnerLines;
  }

  /**
   * Identify which encoding has the given file.
   * To check it, we decode and parse the first line of the file with supported encodings.
   * If there is one with at least "First name" or "Student number" correctly parsed and decoded.
   */
  getEncoding() {
    const supported_encodings = this.#supportedEncodings;
    for (const encoding of supported_encodings) {
      const decodedInput = iconv.decode(this.#input, encoding);
      if (!decodedInput.includes('�')) {
        return encoding;
      }
    }

    this.#errors.push(new CsvImportError(ERRORS.ENCODING_NOT_SUPPORTED));
    this.#throwHasErrors();
  }

  #throwHasErrors() {
    if (this.#errors.length > 0) throw this.#errors;
  }

  #parse(encoding) {
    const decodedInput = iconv.decode(this.#input, encoding);
    const {
      data: learnerLines,
      meta: { fields },
      errors,
    } = papa.parse(decodedInput, PARSING_OPTIONS);

    if (errors.length) {
      const hasErrors = errors.some((error) => ['Delimiter', 'FieldMismatch'].includes(error.type));

      if (hasErrors) {
        this.#errors.push(new CsvImportError(ERRORS.BAD_CSV_FORMAT));
      }
    }

    this.#throwHasErrors();

    return { learnerLines, fields };
  }

  #checkColumns(parsedColumns) {
    // Required columns
    const mandatoryColumn = this.#columns.filter((c) => c.isRequired);

    mandatoryColumn.forEach((colum) => {
      if (!parsedColumns.includes(colum.name)) {
        this.#errors.push(new CsvImportError(ERRORS.HEADER_REQUIRED, { field: colum.name }));
      }
    });

    // Expected columns
    const acceptedColumns = this.#columns.map((column) => column.name);

    const unknowColumns = parsedColumns.filter((columnName) => !acceptedColumns.includes(columnName));

    unknowColumns.forEach((columnName) => {
      if (columnName !== '') this.#errors.push(new CsvImportError(ERRORS.HEADER_UNKNOWN, { field: columnName }));
    });
  }
}

export { CommonCsvLearnerParser };
