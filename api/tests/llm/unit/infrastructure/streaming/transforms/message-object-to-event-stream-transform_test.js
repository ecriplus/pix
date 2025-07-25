import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

import { getTransform } from '../../../../../../src/llm/infrastructure/streaming/transforms/message-object-to-event-stream-transform.js';
import { expect } from '../../../../../test-helper.js';

describe('LLM | Unit | Infrastructure | Streaming | Transforms | MessageObjectToEventStreamTransform', function () {
  describe('#getTransform', function () {
    it('should return a Transform that is capable of convert object "message" into event stream data', async function () {
      // given
      const input = [
        { message: 'Coucou les amis comment ça va ?' },
        { pasMessage: 'Ca va super' },
        { message: 'Et toi ?' },
      ];
      const readable = Readable.from(input);
      const transform = getTransform([]);
      let result = '';

      // when
      readable.pipe(transform);
      transform.on('data', (str) => (result = result + str));
      await finished(transform);

      // then
      expect(result).to.equal('data: Coucou les amis comment ça va ?\n\ndata: Et toi ?\n\n');
    });
    it('should return a Transform that is capable of convert object "isValid" into event stream event', async function () {
      // given
      const input = [
        { message: 'Coucou les amis comment ça va ?' },
        { pasMessage: 'Ca va super' },
        { message: 'Et toi ?' },
        {
          usage: { superKey: 'wowouuo' },
          isValid: true,
          message: 'message possible dans le mm chunk que isValid Event',
        },
        {
          usage: { superKey: 'wowouuo' },
          isValid: false,
          message: 'done',
        },
      ];
      const readable = Readable.from(input);
      const transform = getTransform([]);
      let result = '';

      // when
      readable.pipe(transform);
      transform.on('data', (str) => (result = result + str));
      await finished(transform);

      // then
      expect(result).to.equal(
        'data: Coucou les amis comment ça va ?\n\ndata: Et toi ?\n\nevent: victory-conditions-success\ndata: \n\ndata: message possible dans le mm chunk que isValid Event\n\ndata: done\n\n',
      );
    });

    it('should replace "\n" with "\ndata: " to comply with event stream data', async function () {
      // given
      const input = [{ message: '\n des retours à \n la ligne \n\n dans tous les sens\n' }];
      const readable = Readable.from(input);
      const transform = getTransform([]);
      let result = '';

      // when
      readable.pipe(transform);
      transform.on('data', (str) => (result = result + str));
      await finished(transform);

      // then
      expect(result).to.equal(
        'data: \ndata:  des retours à \ndata:  la ligne \ndata: \ndata:  dans tous les sens\ndata: \n\n',
      );
    });

    it('should store the whole message in the accumulator, before converting it to event stream data', async function () {
      // given
      const input = [
        { message: 'Coucou les amis \ncomment ça va ?' },
        { pasMessage: 'Ca va super' },
        { message: 'Et toi ?' },
      ];
      const readable = Readable.from(input);
      const acc = [];
      const transform = getTransform(acc);

      // when
      readable.pipe(transform);
      // eslint-disable-next-line no-empty-function
      transform.on('data', () => {});
      await finished(transform);

      // then
      expect(acc.join('')).to.equal('Coucou les amis \ncomment ça va ?Et toi ?');
    });
  });
});
