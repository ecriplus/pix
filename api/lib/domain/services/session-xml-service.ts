// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'writeOdsUt... Remove this comment to see the full error message
const writeOdsUtils = require('../../infrastructure/utils/ods/write-ods-utils');
// Placeholder in the template ODS file that helps us find the template candidate row in the file.
const CANDIDATE_ROW_MARKER_PLACEHOLDER = 'COUNT';

function getUpdatedXmlWithSessionData({
  stringifiedXml,
  sessionTemplateValues,
  sessionData
}: $TSFixMe) {
  return writeOdsUtils.updateXmlSparseValues({
    stringifiedXml,
    templateValues: sessionTemplateValues,
    dataToInject: sessionData,
  });
}

function getUpdatedXmlWithCertificationCandidatesData({
  stringifiedXml,
  candidateTemplateValues,
  candidatesData
}: $TSFixMe) {
  return writeOdsUtils.updateXmlRows({
    stringifiedXml,
    rowMarkerPlaceholder: CANDIDATE_ROW_MARKER_PLACEHOLDER,
    rowTemplateValues: candidateTemplateValues,
    dataToInject: candidatesData,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getUpdatedXmlWithSessionData,
  getUpdatedXmlWithCertificationCandidatesData,
};
