import { service } from '@ember/service';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export const assessmentStates = {
  COMPLETED: 'completed',
  STARTED: 'started',
  ABORTED: 'aborted',
  ENDED_BY_INVIGILATOR: 'endedByInvigilator',
  ENDED_DUE_TO_FINALIZATION: 'endedDueToFinalization',
};

export const assessmentResultStatus = {
  CANCELLED: 'cancelled',
  ERROR: 'error',
  VALIDATED: 'validated',
  REJECTED: 'rejected',
};

export const certificationStatuses = [
  { value: assessmentResultStatus.CANCELLED, label: 'Annulée' },
  { value: assessmentStates.STARTED, label: 'Démarrée' },
  { value: assessmentResultStatus.ERROR, label: 'En erreur' },
  { value: assessmentResultStatus.VALIDATED, label: 'Validée' },
  { value: assessmentResultStatus.REJECTED, label: 'Rejetée' },
];

export default class Certification extends Model {
  @service intl;

  @attr() sessionId;
  @attr() assessmentId;
  @attr() userId;
  @attr() firstName;
  @attr() lastName;
  @attr('date-only') birthdate;
  @attr() sex;
  @attr() birthplace;
  @attr() birthCountry;
  @attr() birthInseeCode;
  @attr() birthPostalCode;
  @attr() createdAt;
  @attr() completedAt;
  @attr() isRejectedForFraud;
  @attr() status;
  @attr() juryId;
  @attr('string') commentForCandidate;
  @attr('string') commentForOrganization;
  @attr('string') commentByJury;
  @attr() pixScore;
  @attr() reachedMeshIndex;
  @attr() competencesWithMark;
  @attr('boolean', { defaultValue: false }) isPublished;
  @attr('number') version;
  @attr('string') candidateSubscription;

  @belongsTo('complementary-certification-course-result-with-external', { async: true, inverse: null })
  complementaryCertificationCourseResultWithExternal;
  @belongsTo('common-complementary-certification-course-result', { async: true, inverse: null })
  commonComplementaryCertificationCourseResult;

  @hasMany('certification-issue-report', { async: true, inverse: 'certification' }) certificationIssueReports;

  get creationDate() {
    return this.intl.formatDate(this.createdAt, { format: 'long' });
  }

  get completionDate() {
    return this.completedAt ? this.intl.formatDate(this.completedAt, { format: 'long' }) : null;
  }

  get certificationType() {
    return this.intl.t(`pages.certifications.certification.certificationTypes.${this.candidateSubscription}`);
  }

  get statusLabelAndValue() {
    return certificationStatuses.find((certificationStatus) => certificationStatus.value === this.status);
  }

  get publishedText() {
    const value = this.isPublished;
    return value ? 'Oui' : 'Non';
  }

  get isCertificationCancelled() {
    return this.status === assessmentResultStatus.CANCELLED;
  }

  get hasComplementaryCertifications() {
    return (
      Boolean(this.commonComplementaryCertificationCourseResult.content) ||
      Boolean(this.complementaryCertificationCourseResultWithExternal.get('pixResult'))
    );
  }

  get indexedCompetences() {
    const competencesWithMarks = this.competencesWithMark;
    return competencesWithMarks.reduce((result, value) => {
      result[value.competence_code] = { index: value.competence_code, level: value.level, score: value.score };
      return result;
    }, {});
  }

  get competences() {
    const indexedCompetences = this.indexedCompetences;
    return Object.keys(indexedCompetences)
      .sort()
      .reduce((result, value) => {
        result.push(indexedCompetences[value]);
        return result;
      }, []);
  }

  get isV3() {
    return this.version === 3;
  }

  get result() {
    const scope = this.candidateSubscription == 'CLEA' ? 'CORE' : this.candidateSubscription;
    if (this.version != 3 || (scope == 'CORE' && this.reachedMeshIndex == 0)) {
      return `${this.pixScore} Pix`;
    }
    const strReachedLevel = this.intl.t(
      `components.certifications.meshLevels.${scope}.${String(this.reachedMeshIndex)}`,
    );
    const strPixScore = this.pixScore ? ` (${this.pixScore} Pix)` : '';
    return strReachedLevel + strPixScore;
  }

  wasBornInFrance() {
    return this.birthCountry === 'FRANCE';
  }

  getInformation() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthdate: this.birthdate,
      birthplace: this.birthplace,
      sex: this.sex,
      birthInseeCode: this.birthInseeCode,
      birthPostalCode: this.birthPostalCode,
      birthCountry: this.birthCountry,
    };
  }

  updateInformation({
    firstName,
    lastName,
    birthdate,
    birthplace,
    sex,
    birthInseeCode,
    birthPostalCode,
    birthCountry,
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.sex = sex;
    this.birthInseeCode = birthInseeCode;
    this.birthPostalCode = birthPostalCode;
    this.birthCountry = birthCountry;
  }
}
