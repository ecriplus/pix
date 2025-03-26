import _ from 'lodash';

import { KnowledgeElement } from '../../../../shared/domain/models/KnowledgeElement.js';

class KnowledgeElementCollection {
  constructor(knowledgeElements = []) {
    this.knowledgeElements = knowledgeElements;
  }

  get latestUniqNonResetKnowledgeElements() {
    return _(this.knowledgeElements)
      .orderBy('createdAt', 'desc')
      .uniqBy('skillId')
      .reject({ status: KnowledgeElement.StatusType.RESET })
      .value();
  }

  toSnapshot() {
    return JSON.stringify(
      this.latestUniqNonResetKnowledgeElements.map((ke) =>
        _.pick(ke, ['createdAt', 'source', 'status', 'earnedPix', 'skillId', 'competenceId']),
      ),
    );
  }
}

export { KnowledgeElementCollection };
