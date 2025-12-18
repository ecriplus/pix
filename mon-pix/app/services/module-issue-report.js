import Service, { service } from '@ember/service';
import ENV from 'mon-pix/config/environment';

export default class ModuleIssueReport extends Service {
  @service requestManager;

  initialize({ moduleId, passageId }) {
    this.moduleId = moduleId;
    this.passageId = passageId;
  }

  record({ elementId, answer, categoryKey, comment }) {
    const moduleIssueReport = {
      'module-id': this.moduleId,
      'passage-id': this.passageId,
      'element-id': elementId,
      answer,
      'category-key': categoryKey,
      comment,
    };

    this.requestManager.request({
      url: `${ENV.APP.API_HOST}/api/module-issue-reports`,
      method: 'POST',
      body: JSON.stringify({ data: { attributes: moduleIssueReport, type: 'module-issue-reports' } }),
    });
  }
}
