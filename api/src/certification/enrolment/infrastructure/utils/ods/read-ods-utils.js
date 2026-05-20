import XLSX from 'xlsx';

import { UnprocessableEntityError } from '../../../../../shared/application/errors/http-errors.js';
import isEmpty from '../../../../../shared/infrastructure/utils/is-empty.js';
import { loadOdsZip } from './common-ods-utils.js';

const CONTENT_XML_IN_ODS = 'content.xml';

export async function getContentXml({ odsFilePath }) {
  const zip = await loadOdsZip(odsFilePath);
  const contentXmlBufferCompressed = zip.file(CONTENT_XML_IN_ODS);
  const uncompressedBuffer = await contentXmlBufferCompressed.async('nodebuffer');
  return Buffer.from(uncompressedBuffer, 'utf8').toString();
}

export async function extractTableDataFromOdsFile({ odsBuffer, tableHeaderTargetPropertyMap }) {
  const sheetDataRows = await getSheetDataRowsFromOdsBuffer({ odsBuffer });
  const tableHeaders = tableHeaderTargetPropertyMap.map((tt) => tt.header);
  const sheetHeaderRow = _findHeaderRow(sheetDataRows, tableHeaders);
  if (!sheetHeaderRow) {
    throw new UnprocessableEntityError('Table headers not found');
  }
  const sheetDataRowsBelowHeader = _extractRowsBelowHeader(sheetHeaderRow, sheetDataRows);
  const sheetHeaderPropertyMap = _mapSheetHeadersWithProperties(sheetHeaderRow, tableHeaderTargetPropertyMap);

  const dataByLine = _transformSheetDataRows(sheetDataRowsBelowHeader, sheetHeaderPropertyMap);
  if (isEmpty(dataByLine)) {
    throw new UnprocessableEntityError('No data in table');
  }
  return dataByLine;
}

export async function validateOdsHeaders({ odsBuffer, headers }) {
  const sheetDataRows = await getSheetDataRowsFromOdsBuffer({ odsBuffer });
  const headerRow = _findHeaderRow(sheetDataRows, headers);
  if (!headerRow) {
    throw new UnprocessableEntityError('Unknown attendance sheet version');
  }
}

export async function getSheetDataRowsFromOdsBuffer({ odsBuffer, jsonOptions = { header: 'A' } }) {
  let document;
  try {
    document = await XLSX.read(odsBuffer, { type: 'buffer', cellDates: true });
  } catch (error) {
    throw new UnprocessableEntityError(error);
  }
  const sheet = document.Sheets[document.SheetNames[0]];
  const sheetDataRows = XLSX.utils.sheet_to_json(sheet, jsonOptions);
  if (isEmpty(sheetDataRows)) {
    throw new UnprocessableEntityError('Empty data in sheet');
  }
  return sheetDataRows;
}

function _extractRowsBelowHeader(sheetHeaderRow, sheetDataRows) {
  const headerIndex = sheetDataRows.findIndex((row) => row === sheetHeaderRow);
  return _takeRightUntilIndex({ array: sheetDataRows, index: headerIndex + 1 });
}

function _takeRightUntilIndex({ array, index }) {
  const countElementsToTake = array.length - index;
  if (countElementsToTake === 0) return [];
  return array.slice(countElementsToTake * -1);
}

function _findHeaderRow(sheetDataRows, tableHeaders) {
  return sheetDataRows.find((row) => _allHeadersValuesAreInTheRow(row, tableHeaders));
}

function _allHeadersValuesAreInTheRow(row, headers) {
  const cellValuesInRow = Object.values(row);
  const strippedCellValuesInRow = cellValuesInRow.map(_removeNewlineCharacters);
  const strippedHeaders = headers.map(_removeNewlineCharacters);
  const headersInRow = strippedCellValuesInRow.filter((value) => strippedHeaders.includes(value));
  return headersInRow.length === headers.length;
}

function _removeNewlineCharacters(header) {
  const isHeaderIsString = typeof header.valueOf() === 'string';
  return isHeaderIsString ? header.replace(/[\n\r]/g, '') : header;
}

function _mapSheetHeadersWithProperties(sheetHeaderRow, tableHeaderTargetPropertyMap) {
  return Object.keys(sheetHeaderRow)
    .map((key) => {
      const v = sheetHeaderRow[key];

      const targetProperties = _findTargetPropertiesByHeader(tableHeaderTargetPropertyMap, v);
      if (targetProperties) {
        const { property: targetProperty, transformFn } = targetProperties;
        return { columnName: key, targetProperty, transformFn };
      }
    })
    .filter(Boolean);
}

function _findTargetPropertiesByHeader(tableHeaderTargetPropertyMap, header) {
  const mapWithSanitizedHeaders = tableHeaderTargetPropertyMap.map((obj) => ({
    ...obj,
    header: _removeNewlineCharacters(obj.header),
  }));

  return mapWithSanitizedHeaders.find((h) => h.header === _removeNewlineCharacters(header));
}

function _transformSheetDataRows(sheetDataRows, sheetHeaderPropertyMap) {
  const dataByLine = {};
  for (const sheetDataRow of sheetDataRows) {
    dataByLine[sheetDataRow['__rowNum__']] = _transformSheetDataRow(sheetDataRow, sheetHeaderPropertyMap);
  }
  return dataByLine;
}

function _transformSheetDataRow(sheetDataRow, sheetHeaderPropertyMap) {
  return sheetHeaderPropertyMap.reduce((target, { columnName, targetProperty, transformFn }) => {
    const cellValue = sheetDataRow[columnName];
    target[targetProperty] = transformFn(cellValue);
    return target;
  }, {});
}
