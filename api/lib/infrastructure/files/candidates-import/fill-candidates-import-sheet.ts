// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'writeOdsUt... Remove this comment to see the full error message
const writeOdsUtils = require('../../utils/ods/write-ods-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readOdsUti... Remove this comment to see the full error message
const readOdsUtils = require('../../utils/ods/read-ods-utils');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EXTRA_EMPT... Remove this comment to see the full error message
  EXTRA_EMPTY_CANDIDATE_ROWS,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'IMPORT_CAN... Remove this comment to see the full error message
  IMPORT_CANDIDATES_TEMPLATE_VALUES,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'IMPORT_CAN... Remove this comment to see the full error message
  IMPORT_CANDIDATES_SESSION_TEMPLATE_VALUES,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./candidates-import-placeholders');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../domain/models/CertificationCandidate');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CandidateData = require('./CandidateData');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SessionData = require('./SessionData');

const billingValidatorList = Object.values(CertificationCandidate.BILLING_MODES).map(
  CertificationCandidate.translateBillingMode
);

const INFORMATIVE_HEADER_ROW = 8;
const HEADER_ROW_SPAN = 3;
const CANDIDATE_TABLE_HEADER_ROW = 11;
const CANDIDATE_TABLE_FIRST_ROW = 12;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function fillCandidatesImportSheet({
  session,
  certificationCenterHabilitations,
  isScoCertificationCenter
}: $TSFixMe) {
  const template = await _getCandidatesImportTemplate();

  const odsBuilder = new writeOdsUtils.OdsUtilsBuilder(template);
  _addSession(odsBuilder, session);
  _addColumns({
    odsBuilder,
    certificationCenterHabilitations,
    isScoCertificationCenter,
  });
  _addCandidateRows(odsBuilder, session.certificationCandidates);

  return odsBuilder.build({ templateFilePath: _getCandidatesImportTemplatePath() });
};

async function _getCandidatesImportTemplate() {
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const templatePath = __dirname + '/1.5/candidates_import_template.ods';
  return readOdsUtils.getContentXml({ odsFilePath: templatePath });
}

function _addSession(odsBuilder: $TSFixMe, session: $TSFixMe) {
  const sessionData = SessionData.fromSession(session);
  return odsBuilder.withData(sessionData, IMPORT_CANDIDATES_SESSION_TEMPLATE_VALUES);
}

function _addColumns({
  odsBuilder,
  certificationCenterHabilitations,
  isScoCertificationCenter
}: $TSFixMe) {
  if (!isScoCertificationCenter) {
    odsBuilder
      .withTooltipOnCell({
        targetCellAddress: "'Liste des candidats'.O13",
        tooltipName: 'val-prepayment-code',
        tooltipTitle: 'Code de prépaiement',
        tooltipContentLines: [
          "(Requis notamment dans le cas d'un achat de crédits combinés)",
          'Doit être composé du SIRET de l’organisation et du numéro de facture. Ex : 12345678912345/FACT12345',
          'Si vous ne possédez pas de facture, un code de prépaiement doit être établi avec Pix.',
        ],
      })
      .withValidatorRestrictedList({
        validatorName: 'billingModeValidator',
        restrictedList: billingValidatorList,
        allowEmptyCell: false,
        tooltipTitle: 'Tarification part Pix',
        tooltipContentLines: ['Options possibles :', ...billingValidatorList.map((option) => `- ${option}`)],
      })
      .withColumnGroup({
        groupHeaderLabel: 'Tarification',
        columns: [
          {
            headerLabel: ['Tarification part Pix'],
            placeholder: ['billingMode'],
          },
          {
            headerLabel: ['Code de prépaiement'],
            placeholder: ['prepaymentCode'],
          },
        ],
        startsAt: INFORMATIVE_HEADER_ROW,
        headerRowSpan: HEADER_ROW_SPAN,
        tableHeaderRow: CANDIDATE_TABLE_HEADER_ROW,
        tableFirstRow: CANDIDATE_TABLE_FIRST_ROW,
      });
  }
  odsBuilder = _addComplementaryCertificationColumns({ odsBuilder, certificationCenterHabilitations });

  return odsBuilder;
}

function _addComplementaryCertificationColumns({
  odsBuilder,
  certificationCenterHabilitations
}: $TSFixMe) {
  if (!_.isEmpty(certificationCenterHabilitations)) {
    const habilitationColumns = certificationCenterHabilitations.map(({
      key,
      label
    }: $TSFixMe) => ({
      headerLabel: [label, '("oui" ou laisser vide)'],
      placeholder: [key],
    }));
    odsBuilder.withColumnGroup({
      groupHeaderLabel: 'Certification(s) complémentaire(s)',
      columns: habilitationColumns,
      startsAt: INFORMATIVE_HEADER_ROW,
      headerRowSpan: HEADER_ROW_SPAN,
      tableHeaderRow: CANDIDATE_TABLE_HEADER_ROW,
      tableFirstRow: CANDIDATE_TABLE_FIRST_ROW,
    });
  }
  return odsBuilder;
}

function _addCandidateRows(odsBuilder: $TSFixMe, certificationCandidates: $TSFixMe) {
  const CANDIDATE_ROW_MARKER_PLACEHOLDER = 'COUNT';
  const candidatesData = _getCandidatesData(certificationCandidates);
  return odsBuilder.updateXmlRows({
    rowMarkerPlaceholder: CANDIDATE_ROW_MARKER_PLACEHOLDER,
    rowTemplateValues: IMPORT_CANDIDATES_TEMPLATE_VALUES,
    dataToInject: candidatesData,
  });
}

function _getCandidatesData(certificationCandidates: $TSFixMe) {
  const enrolledCandidatesData = _certificationCandidatesToCandidatesData(certificationCandidates);

  const emptyCandidatesData = _emptyCandidatesData(enrolledCandidatesData.length);

  return enrolledCandidatesData.concat(emptyCandidatesData);
}

function _getCandidatesImportTemplatePath() {
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  return __dirname + '/1.5/candidates_import_template.ods';
}

function _certificationCandidatesToCandidatesData(certificationCandidates: $TSFixMe) {
  return _.map(certificationCandidates, (candidate: $TSFixMe, index: $TSFixMe) => {
    return CandidateData.fromCertificationCandidateAndCandidateNumber(candidate, index + 1);
  });
}

function _emptyCandidatesData(numberOfEnrolledCandidates: $TSFixMe) {
  const emptyCandidates: $TSFixMe = [];
  _.times(EXTRA_EMPTY_CANDIDATE_ROWS, (index: $TSFixMe) => {
    const emptyCandidateData = CandidateData.empty(numberOfEnrolledCandidates + (index + 1));

    emptyCandidates.push(emptyCandidateData);
  });

  return emptyCandidates;
}
