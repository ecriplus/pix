import { Image } from '../../../../../../src/devcomp/domain/models/element/Image.js';
import { QCU } from '../../../../../../src/devcomp/domain/models/element/QCU.js';
import { QROCM } from '../../../../../../src/devcomp/domain/models/element/QROCM.js';
import { Text } from '../../../../../../src/devcomp/domain/models/element/Text.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | Element', function () {
  describe('#isAnswerable', function () {
    it('should instanciate answerable elements', function () {
      // Given
      const qcu = new QCU({
        id: '123',
        instruction: 'instruction',
        locales: ['fr-FR'],
        proposals: [Symbol('proposal1'), Symbol('proposal2')],
      });

      const qrocm = new QROCM({
        id: '1',
        instruction: '',
        locales: ['fr-FR'],
        proposals: [Symbol('block')],
      });

      const answerableElements = [qcu, qrocm];

      // Then
      answerableElements.forEach((element) => expect(element.isAnswerable).to.be.true);
    });

    it('should instanciate non answerable elements', function () {
      // Given
      const text = new Text({ id: 'id', content: 'content' });
      const image = new Image({ id: 'id', url: 'url', alt: 'alt', alternativeText: 'alternativeText' });

      const nonAnswerableElements = [text, image];

      // Then
      nonAnswerableElements.forEach((element) => expect(element.isAnswerable).to.be.false);
    });
  });
});
