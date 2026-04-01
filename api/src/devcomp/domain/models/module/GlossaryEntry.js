import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';

class GlossaryEntry {
  constructor({ word, definition }) {
    assertNotNullOrUndefined(word, 'The word is required for module glossary');
    assertNotNullOrUndefined(definition, 'The definition is required for module glossary');

    this.word = word;
    this.definition = definition;
  }
}

export { GlossaryEntry };
