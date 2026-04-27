import { LearningContentRepository } from './learning-content-repository.js';

class ModuleRepository extends LearningContentRepository {
  constructor() {
    super({ tableName: 'learningcontent.modules' });
  }

  toDto({ id, shortId, slug, title, isBeta, sections, details, visibility, glossary }) {
    return {
      id,
      shortId,
      slug,
      title,
      isBeta,
      sections: JSON.stringify(sections),
      visibility,
      glossary: JSON.stringify(glossary),
      ...details,
    };
  }

  clearCache(_id) {
    // FIXME
  }
}

export const moduleRepository = new ModuleRepository();
