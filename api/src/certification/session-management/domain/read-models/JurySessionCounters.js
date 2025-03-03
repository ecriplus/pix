/**
 * @typedef IssueReport
 * @type {Object}
 * @property {string} category
 * @property {string} subcategory
 * @property {Date} resolvedAt
 */

import {
  ImpactfulCategories,
  ImpactfulSubcategories,
} from '../../../shared/domain/models/CertificationIssueReportCategory.js';

export class JurySessionCounters {
  /**
   * Number of certifications that are still on going
   * @type {number}
   */
  startedCertifications = 0;

  /**
   * Number of certifications that ended up with errors during scoring
   * @type {number}
   */
  certificationsWithScoringError = 0;

  /**
   * Number  of issue reports that was raised during the session
   * @type {number}
   */
  issueReports = 0;

  /**
   * Number of issue reports that are not resolved and requires a jury decision
   * @type {number}
   */
  impactfullIssueReports = 0;

  /**
   * @param {Object} params
   * @param {number} params.startedCoursesCount
   * @param {number} params.certificationWithScoringError
   * @param {Array<IssueReport>} params.issueReports
   */
  constructor({ startedCoursesCount = 0, certificationWithScoringError = 0, issueReports = [] }) {
    this.startedCoursesCount = startedCoursesCount;
    this.certificationWithScoringError = certificationWithScoringError;
    this.issueReports = issueReports.length;

    // TODO : fichier de test du read model, ce calcul contient + de variantes qu'on le teste dans le test d'integ du repo
    this.impactfullIssueReports = this.#countImpactfulIssueReport(issueReports);
  }

  /**
   * @param {Array<IssueReport>} params.issueReports
   */
  #countImpactfulIssueReport(issueReports) {
    return issueReports.reduce((counter, issueReport) => {
      if (this.#isImpactfulIssueReport(issueReport) && this.#isUnresolvedIssueReport(issueReport)) {
        return (counter += 1);
      }

      return counter;
    }, 0);
  }

  /**
   * @param {IssueReport} params.issueReport
   */
  #isImpactfulIssueReport(issueReport) {
    return (
      ImpactfulCategories.includes(issueReport.category) || ImpactfulSubcategories.includes(issueReport.subcategory)
    );
  }

  /**
   * @param {IssueReport} params.issueReport
   */
  #isUnresolvedIssueReport(issueReport) {
    return !issueReport.resolvedAt;
  }
}
