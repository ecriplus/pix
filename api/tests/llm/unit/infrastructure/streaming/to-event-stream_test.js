import { findObjects, toEventStreamData } from '../../../../../src/llm/infrastructure/streaming/to-event-stream.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Unit | Infrastructure | Streaming | ToEventStream', function () {
  describe('#findObjects', function () {
    it('should extract the content of "messages" key in each object found in the string', async function () {
      // given
      const incomingStr =
        '14:{"message":""}25:{"truc":{"machin":"oui"}}83:{"quelquechose":"de different {\\"message\\":\\"feinte !\\"","message":"aeza\\"\\"{}()\'"}57:{"message":"\\"\\"{}()Izhoidze156:{\\"message\\":\\"troll\\"\'"}25:{"truc":{"machin":"oui"}}';

      // when
      const messages = findObjects(incomingStr);

      // then
      expect(messages).to.deep.equal([
        { message: '' },
        { truc: { machin: 'oui' } },
        { quelquechose: 'de different {"message":"feinte !"', message: 'aeza""{}()\'' },
        { message: '""{}()Izhoidze156:{"message":"troll"\'' },
        { truc: { machin: 'oui' } },
      ]);
    });
  });

  describe('#toEventStreamData', function () {
    it('should wrap the message _message_ in data: _message_\n\n', function () {
      // when
      const formattedMessage = toEventStreamData('Coucou les amis comment ça va ?');

      // then
      expect(formattedMessage).to.equal('data: Coucou les amis comment ça va ?\n\n');
    });

    it('should replace "\n" with "\ndata: " to comply with event stream data', function () {
      // given
      const message = '\n des retours à \n la ligne \n\n dans tous les sens\n';

      // when
      const formattedMessage = toEventStreamData(message);

      // then
      expect(formattedMessage).to.equal(
        'data: \ndata:  des retours à \ndata:  la ligne \ndata: \ndata:  dans tous les sens\ndata: \n\n',
      );
    });
  });
});
