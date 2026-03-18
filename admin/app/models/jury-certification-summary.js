import { service } from '@ember/service';
import Model, { attr } from '@ember-data/model';
import find from 'lodash/find';

import { assessmentStates, certificationStatuses } from './certification';

export const juryCertificationSummaryStatuses = [
  { value: assessmentStates.ENDED_BY_INVIGILATOR, label: 'Terminée par le surveillant' },
];

const statuses = [...certificationStatuses, ...juryCertificationSummaryStatuses];
export default class JuryCertificationSummary extends Model {
  @service intl;

  @attr() firstName;
  @attr() lastName;
  @attr() status;
  @attr() pixScore;
  @attr() reachedMeshIndex;
  @attr() createdAt;
  @attr() completedAt;
  @attr() isPublished;
  @attr() examinerComment;
  @attr() numberOfCertificationIssueReports;
  @attr() isFlaggedAborted;
  @attr('string') certificationFramework;
  @attr() numberOfCertificationIssueReportsWithRequiredAction;

  get creationDate() {
    return this.intl.formatDate(this.createdAt, { format: 'long' });
  }

  get completionDate() {
    return this.completedAt ? this.intl.formatDate(this.completedAt, { format: 'long' }) : null;
  }

  get numberOfCertificationIssueReportsWithRequiredActionLabel() {
    return this.numberOfCertificationIssueReportsWithRequiredAction > 0
      ? this.numberOfCertificationIssueReportsWithRequiredAction
      : '';
  }

  get statusLabel() {
    const statusWithLabel = find(statuses, { value: this.status });
    return statusWithLabel?.label;
  }

  get isCertificationStarted() {
    return this.status === 'started';
  }

  get isCertificationInError() {
    return this.status === 'error';
  }

  get isCertificationWithCoreScope() {
    return this.certificationFramework == 'CORE' || this.certificationFramework == 'CLEA';
  }

  get certificationObtained() {
    if (!this.reachedMeshIndex) {
      return this.intl.t(`pages.certifications.certification.certificationTypesV2.${this.certificationFramework}`);
    }
    return this.intl.t(`pages.certifications.certification.certificationTypesV3.${this.certificationFramework}`);
  }

  get result() {
    const scope = this.certificationFramework == 'CLEA' ? 'CORE' : this.certificationFramework;
    if (!this.reachedMeshIndex || (scope == 'CORE' && this.reachedMeshIndex == 0)) {
      return `${this.pixScore} Pix`;
    }
    const strReachedLevel = this.intl.t(
      `components.certifications.meshLevels.${scope}.${String(this.reachedMeshIndex)}`,
    );
    const strPixScore = this.pixScore ? ` (${this.pixScore} Pix)` : '';
    return strReachedLevel + strPixScore;
  }
}
