import _ from 'lodash';

import { KnowledgeElement } from '../../../../shared/domain/models/KnowledgeElement.js';

class KnowledgeElementCollection {
  constructor(knowledgeElements = []) {
    this.knowledgeElements = knowledgeElements;
  }

  get latestUniqNonResetKnowledgeElements() {
    return _(this.knowledgeElements)
      .orderBy('createdAt', 'desc')
      .reject({ status: KnowledgeElement.StatusType.RESET })
      .uniqBy('skillId')
      .value();
  }

  toSnapshot() {
    return JSON.stringify(this.latestUniqNonResetKnowledgeElements.map((ke) => _.omit(ke, ['assessmentId', 'userId'])));
  }
}

export { KnowledgeElementCollection };
