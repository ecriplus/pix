import {
  extractMessages,
  toEventStreamData,
} from '../../../../../src/llm/infrastructure/repositories/prompt-repository.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Integration | Application | API | llm', function () {
  describe('#extractMessages', function () {
    it('should identify the messages even with special characters inside of them', async function () {
      const str1 =
        '13:{"message":"\\aeza\\"\\"{}()\'"}56:{"message":"\\"\\"{}()Izhoidze156:{\\"message\\":\\"troll\\"\'"}584:{"truc":{"machin":"oui"}}';
      const messages = extractMessages(str1);

      expect(messages).to.deep.equal(['\\aeza\\"\\"{}()\'', '\\"\\"{}()Izhoidze156:{\\"message\\":\\"troll\\"\'']);
    });
  });

  describe('#toEventStreamData', function () {
    it('should return the message formatted as required for an Event Stream Data', function () {
      // given
      const messages = ['mon super message', ' qui tient sur une ligne.'];

      // when
      const formattedMessages = toEventStreamData(messages);

      // then
      expect(formattedMessages).to.deep.equal('data: mon super message qui tient sur une ligne.\n\n');
    });
  });
});
