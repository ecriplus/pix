import { KnowledgeElement } from '../../../../shared/domain/models/KnowledgeElement.js';

class KnowledgeElementCollection {
  constructor(knowledgeElements = []) {
    this.knowledgeElements = knowledgeElements;
  }

  get latestUniqNonResetKnowledgeElements() {
    const seen = new Set();

    return this.knowledgeElements
      .toSorted((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((el) => {
        if (seen.has(el.skillId)) return false;
        seen.add(el.skillId);
        return true;
      })
      .filter((el) => el.status !== KnowledgeElement.StatusType.RESET);
  }

  toSnapshot() {
    return JSON.stringify(
      this.latestUniqNonResetKnowledgeElements.map(
        ({ createdAt, source, status, earnedPix, skillId, competenceId }) => {
          return { createdAt, source, status, earnedPix, skillId, competenceId };
        },
      ),
    );
  }
}

export { KnowledgeElementCollection };
