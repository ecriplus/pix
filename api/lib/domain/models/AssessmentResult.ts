// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('./Assessment');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'status'.
const status = {
  REJECTED: 'rejected',
  VALIDATED: 'validated',
  ERROR: 'error',
  CANCELLED: 'cancelled',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentResult {
  static status = status;

  assessmentId: $TSFixMe;
  commentForCandidate: $TSFixMe;
  commentForJury: $TSFixMe;
  commentForOrganization: $TSFixMe;
  competenceMarks: $TSFixMe;
  createdAt: $TSFixMe;
  emitter: $TSFixMe;
  id: $TSFixMe;
  juryId: $TSFixMe;
  pixScore: $TSFixMe;
  reproducibilityRate: $TSFixMe;

  constructor({
    id,
    commentForCandidate,
    commentForJury,
    commentForOrganization,
    createdAt,
    emitter,
    pixScore,
    reproducibilityRate,
    status,
    competenceMarks = [],
    assessmentId,
    juryId
  }: $TSFixMe = {}) {
    this.id = id;
    this.commentForCandidate = commentForCandidate;
    this.commentForJury = commentForJury;
    this.commentForOrganization = commentForOrganization;
    this.createdAt = createdAt;
    this.emitter = emitter;
    this.pixScore = pixScore;
    this.reproducibilityRate = reproducibilityRate;
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Assessme... Remove this comment to see the full error message
    this.status = status;
    this.competenceMarks = competenceMarks;
    this.assessmentId = assessmentId;
    this.juryId = juryId;
  }

  static buildAlgoErrorResult({
    error,
    assessmentId,
    juryId,
    emitter
  }: $TSFixMe) {
    return new AssessmentResult({
      emitter,
      commentForJury: error.message,
      pixScore: 0,
      reproducibilityRate: 0,
      status: status.ERROR,
      assessmentId,
      juryId,
    });
  }

  static buildStandardAssessmentResult({
    pixScore,
    reproducibilityRate,
    status,
    assessmentId,
    juryId,
    emitter
  }: $TSFixMe) {
    return new AssessmentResult({
      emitter,
      commentForJury: 'Computed',
      pixScore,
      reproducibilityRate,
      status,
      assessmentId,
      juryId,
    });
  }

  static buildStartedAssessmentResult({
    assessmentId
  }: $TSFixMe) {
    return new AssessmentResult({
      assessmentId,
      status: Assessment.states.STARTED,
    });
  }

  static buildNotTrustableAssessmentResult({
    pixScore,
    reproducibilityRate,
    status,
    assessmentId,
    juryId,
    emitter
  }: $TSFixMe) {
    return new AssessmentResult({
      emitter,
      commentForCandidate:
        'Un ou plusieurs problème(s) technique(s), signalé(s) à votre surveillant pendant la session de certification' +
        ', a/ont affecté la qualité du test de certification. En raison du trop grand nombre de questions auxquelles vous ' +
        "n'avez pas pu répondre dans de bonnes conditions, nous ne sommes malheureusement pas en mesure de calculer un " +
        'score fiable et de fournir un certificat. La certification est annulée, le prescripteur de votre certification' +
        '(le cas échéant), en est informé.',
      commentForOrganization:
        'Un ou plusieurs problème(s) technique(s), signalés par ce(cette) candidate au surveillant' +
        'de la session de certification, a/ont affecté le bon déroulement du test de certification. Nous sommes dans ' +
        "l'incapacité de le/la certifier, sa certification est donc annulée. Cette information est à prendre en compte " +
        'et peut vous conduire à proposer une nouvelle session de certification pour ce(cette) candidat(e).',
      commentForJury: 'Computed',
      pixScore,
      reproducibilityRate,
      status,
      assessmentId,
      juryId,
    });
  }

  isValidated() {
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Assessme... Remove this comment to see the full error message
    return this.status === status.VALIDATED;
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AssessmentResult;
