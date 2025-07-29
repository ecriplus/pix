import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

import _ from 'lodash';

import { getTransform } from '../../../../../../src/llm/infrastructure/streaming/transforms/message-object-to-event-stream-transform.js';
import { expect } from '../../../../../test-helper.js';

describe('LLM | Unit | Infrastructure | Streaming | Transforms | MessageObjectToEventStreamTransform', function () {
  describe('#getTransform', function () {
    let streamCapture;
    beforeEach(function () {
      streamCapture = {
        LLMMessageParts: [],
        haveVictoryConditionsBeenFulfilled: false,
        inputTokens: 0,
        outputTokens: 0,
      };
    });

    it('should return a Transform that is capable of convert object "message" into event stream data', async function () {
      // given
      const input = [
        { message: 'Coucou les amis comment ça va ?' },
        { pasMessage: 'Ca va super' },
        { message: 'Et toi ?' },
      ];
      const readable = Readable.from(input);
      const transform = getTransform(streamCapture);
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
      const transform = getTransform(streamCapture);
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
      const transform = getTransform(streamCapture);
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

    context('streamCapture', function () {
      it('should store all the LLM response message parts in the streamCapture object while transforming', async function () {
        // given
        const input = [
          { message: 'Coucou les amis \ncomment ça va ?' },
          { pasMessage: 'Ca va super' },
          { message: 'Et toi ?' },
        ];
        const readable = Readable.from(input);
        const transform = getTransform(streamCapture);

        // when
        readable.pipe(transform);
        // eslint-disable-next-line no-empty-function
        transform.on('data', () => {});
        await finished(transform);

        // then
        expect(_.omit(streamCapture, 'LLMMessageParts')).to.deep.equal({
          haveVictoryConditionsBeenFulfilled: false,
          inputTokens: 0,
          outputTokens: 0,
        });
        expect(streamCapture.LLMMessageParts.join('')).to.equal('Coucou les amis \ncomment ça va ?Et toi ?');
      });

      it('should toggle "haveVictoryConditionsBeenFulfilled" to true when isValid: true appears in stream', async function () {
        // given
        const input = [
          { message: 'Coucou les amis \ncomment ça va ?' },
          { pasMessage: 'Ca va super' },
          { message: 'Et toi ?' },
          {
            usage: { superKey: 'wowouuo' },
            isValid: true,
          },
        ];
        const readable = Readable.from(input);
        const transform = getTransform(streamCapture);

        // when
        readable.pipe(transform);
        // eslint-disable-next-line no-empty-function
        transform.on('data', () => {});
        await finished(transform);

        // then
        expect(_.omit(streamCapture, 'LLMMessageParts')).to.deep.equal({
          haveVictoryConditionsBeenFulfilled: true,
          inputTokens: 0,
          outputTokens: 0,
        });
        expect(streamCapture.LLMMessageParts.join('')).to.equal('Coucou les amis \ncomment ça va ?Et toi ?');
      });

      it('should capture the inputTokens and outputTokens values in "usage" key if present', async function () {
        // given
        const input = [
          { message: 'Coucou les amis \ncomment ça va ?' },
          { pasMessage: 'Ca va super' },
          { message: 'Et toi ?' },
          {
            usage: { superKey: 'wowouuo', inputTokens: 2_000, outputTokens: 5_000 },
          },
        ];
        const readable = Readable.from(input);
        const transform = getTransform(streamCapture);

        // when
        readable.pipe(transform);
        // eslint-disable-next-line no-empty-function
        transform.on('data', () => {});
        await finished(transform);

        // then
        expect(_.omit(streamCapture, 'LLMMessageParts')).to.deep.equal({
          haveVictoryConditionsBeenFulfilled: false,
          inputTokens: 2_000,
          outputTokens: 5_000,
        });
        expect(streamCapture.LLMMessageParts.join('')).to.equal('Coucou les amis \ncomment ça va ?Et toi ?');
      });
    });
  });
});
