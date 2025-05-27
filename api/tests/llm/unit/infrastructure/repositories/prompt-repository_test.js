import {
  extractMessages,
  toEventStreamData,
} from '../../../../../src/llm/infrastructure/repositories/prompt-repository.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Integration | Infrastructure | Repositories | prompt', function () {
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
      const messages = [
        'mon super message',
        ' qui tient sur une ligne.\n',
        'Je suis une ligne\net je suis une 2e ligne.',
        'pouet\n\npouet',
        '\nune dernière ligne\n',
      ];

      // when
      const formattedMessages = toEventStreamData(messages);

      // then
      expect(formattedMessages).to.deep.equal(
        'data: mon super message\n\ndata:  qui tient sur une ligne.\ndata: \n\ndata: Je suis une ligne\ndata: et je suis une 2e ligne.\n\ndata: pouet\ndata: \ndata: pouet\n\ndata: \ndata: une dernière ligne\ndata: \n\n',
      );
    });
  });
});
