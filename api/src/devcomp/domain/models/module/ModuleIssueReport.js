import { DomainError } from '../../../../shared/domain/errors.js';
import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';

export class ModuleIssueReport {
  constructor({ moduleId, elementId, passageId, answer, userAgent, categoryKey, comment }) {
    assertNotNullOrUndefined(moduleId, 'The moduleId is required for a ModuleIssueReport');
    assertNotNullOrUndefined(elementId, 'The elementId is required for a ModuleIssueReport');
    assertNotNullOrUndefined(passageId, 'The passageId is required for a ModuleIssueReport');
    assertNotNullOrUndefined(categoryKey, 'The categoryKey is required for a ModuleIssueReport');
    assertNotNullOrUndefined(comment, 'The comment is required for a ModuleIssueReport');

    if (comment.trim().length === 0) {
      throw new DomainError('The comment should not be empty');
    }

    this.moduleId = moduleId;
    this.elementId = elementId;
    this.passageId = passageId;
    this.answer = answer;
    this.userAgent = userAgent;
    this.categoryKey = categoryKey;
    this.comment = comment;
  }
}
