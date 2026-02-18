import { Parser } from '@json2csv/plainjs';

import {
  COMPLEMENTARY_CERTIFICATION_SUFFIX,
  headers,
} from '../../../shared/infrastructure/utils/csv/sessions-import.js';

function getCsvHeaders({ habilitationLabels, shouldDisplayBillingModeColumns = true }) {
  const complementaryCertificationsHeaders = _getComplementaryCertificationsHeaders(habilitationLabels);
  const fields = _getHeadersAsArray(complementaryCertificationsHeaders, shouldDisplayBillingModeColumns);
  const json2csvParser = new Parser({
    withBOM: true,
    includeEmptyRows: false,
    fields,
    delimiter: ';',
  });
  return json2csvParser.parse([]);
}

function _getComplementaryCertificationsHeaders(habilitationLabels) {
  return habilitationLabels?.map((habilitationLabel) => `${habilitationLabel} ${COMPLEMENTARY_CERTIFICATION_SUFFIX}`);
}

function _getHeadersAsArray(complementaryCertificationsHeaders = [], shouldDisplayBillingModeColumns) {
  // eslint-disable-next-line no-unused-vars
  const { billingMode, prepaymentCode, ...headersWithoutBillingMode } = headers;
  const certificationCenterCsvHeaders = shouldDisplayBillingModeColumns ? headers : headersWithoutBillingMode;

  const csvHeaders = Object.keys(certificationCenterCsvHeaders).reduce((arr, key) => [...arr, headers[key]], []);
  return [...csvHeaders, ...complementaryCertificationsHeaders];
}

export { getCsvHeaders };
