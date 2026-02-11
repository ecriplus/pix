import { Frameworks } from '../../../configuration/domain/models/Frameworks.js';

const IMPORT_CANDIDATES_SESSION_TEMPLATE_HEADERS = [
  'headers.birthcity',
  'headers.birthcity-inseecode',
  'headers.birthcity-postcode',
  'headers.birthcountry',
  'headers.birth-date',
  'headers.birthname',
  'headers.birthplace',
  'headers.birthplace-instructions',
  'headers.birthplace-instructions-abroad',
  'headers.birthplace-instructions-abroad-insee',
  'headers.birthplace-instructions-france',
  'headers.birthplace-instructions-france-insee',
  'headers.birthplace-instructions-france-postal',
  'headers.born-in-france',
  'headers.born-abroad',
  'headers.candidates',
  'headers.candidates-list',
  'headers.date',
  'headers.email-convocation',
  'headers.email-results',
  'headers.externalid',
  'headers.extra-time',
  'headers.firstname',
  'headers.gender',
  'headers.locale-time',
  'headers.room-name',
  'headers.session-certification',
  'headers.session-invigilates-by',
  'headers.session-invigilators',
  'headers.session-number',
  'headers.site-name',
  'tooltips.date-format',
  'tooltips.email-format',
  'tooltips.email-results',
  'tooltips.gender-format',
  'tooltips.extra-time',
];

const IMPORT_CANDIDATES_SESSION_TEMPLATE_VALUES = [
  {
    placeholder: 'SESSION_ID',
    propertyName: 'id',
  },
  {
    placeholder: 'SESSION_START_DATE',
    propertyName: 'date',
  },
  {
    placeholder: 'SESSION_START_TIME',
    propertyName: 'startTime',
  },
  {
    placeholder: 'SESSION_ADDRESS',
    propertyName: 'address',
  },
  {
    placeholder: 'SESSION_ROOM',
    propertyName: 'room',
  },
  {
    placeholder: 'SESSION_EXAMINER',
    propertyName: 'examiner',
  },
];

const IMPORT_CANDIDATES_TEMPLATE_VALUES = [
  {
    placeholder: 'COUNT',
    propertyName: 'count',
  },
  {
    placeholder: 'LAST_NAME',
    propertyName: 'lastName',
  },
  {
    placeholder: 'FIRST_NAME',
    propertyName: 'firstName',
  },
  {
    placeholder: '01/01/1900',
    propertyName: 'birthdate',
  },
  {
    placeholder: 'SEX',
    propertyName: 'sex',
  },
  {
    placeholder: 'BIRTH_POSTAL_CODE',
    propertyName: 'birthPostalCode',
  },
  {
    placeholder: 'BIRTH_INSEE_CODE',
    propertyName: 'birthINSEECode',
  },
  {
    placeholder: 'BIRTH_CITY',
    propertyName: 'birthCity',
  },
  {
    placeholder: 'BIRTH_COUNTRY',
    propertyName: 'birthCountry',
  },
  {
    placeholder: 'RESULT_RECIPIENT@EXAMPLE.FR',
    propertyName: 'resultRecipientEmail',
  },
  {
    placeholder: 'CONVOCATION@EXAMPLE.FR',
    propertyName: 'email',
  },
  {
    placeholder: 'EXTERNAL_ID',
    propertyName: 'externalId',
  },
  {
    placeholder: '999 %',
    propertyName: 'extraTimePercentage',
  },
  {
    placeholder: 'billingMode',
    propertyName: 'billingMode',
    validator: 'billingModeValidator',
  },
  {
    placeholder: 'prepaymentCode',
    propertyName: 'prepaymentCode',
    validator: 'val-prepayment-code',
  },
  {
    placeholder: Frameworks.CLEA,
    propertyName: Frameworks.CLEA,
  },
  {
    placeholder: Frameworks.DROIT,
    propertyName: Frameworks.DROIT,
  },
  {
    placeholder: Frameworks.EDU_1ER_DEGRE,
    propertyName: Frameworks.EDU_1ER_DEGRE,
  },
  {
    placeholder: Frameworks.EDU_2ND_DEGRE,
    propertyName: Frameworks.EDU_2ND_DEGRE,
  },
  {
    placeholder: Frameworks.PRO_SANTE,
    propertyName: Frameworks.PRO_SANTE,
  },
  {
    placeholder: Frameworks.EDU_CPE,
    propertyName: Frameworks.EDU_CPE,
  },
];

const EXTRA_EMPTY_CANDIDATE_ROWS = 20;

export {
  EXTRA_EMPTY_CANDIDATE_ROWS,
  IMPORT_CANDIDATES_SESSION_TEMPLATE_HEADERS,
  IMPORT_CANDIDATES_SESSION_TEMPLATE_VALUES,
  IMPORT_CANDIDATES_TEMPLATE_VALUES,
};
