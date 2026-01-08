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
  @attr() createdAt;
  @attr() completedAt;
  @attr() isPublished;
  @attr() examinerComment;
  @attr() certificationObtained;
  @attr() complementaryCertificationKeyObtained;
  @attr() numberOfCertificationIssueReports;
  @attr() isFlaggedAborted;
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
    return !this.complementaryCertificationKeyObtained || this.complementaryCertificationKeyObtained == 'CLEA';
  }
}
