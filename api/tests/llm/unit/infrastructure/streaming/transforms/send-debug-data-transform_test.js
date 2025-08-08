import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

import { getTransform } from '../../../../../../src/llm/infrastructure/streaming/transforms/send-debug-data-transform.js';
import { expect } from '../../../../../test-helper.js';

describe('LLM | Unit | Infrastructure | Streaming | Transforms | SendDebugDataTransform', function () {
  describe('#getTransform', function () {
    let streamCapture;
    beforeEach(function () {
      streamCapture = {
        LLMMessageParts: [],
        haveVictoryConditionsBeenFulfilled: false,
        inputTokens: 3000,
        outputTokens: 5000,
        wasModerated: false,
      };
    });

    context('when debugData is enabled', function () {
      it('should return a Transform that write at the end', async function () {
        // given
        const input = [
          'data: Coucou les amis comment ça va ?\n\n',
          'data: Et toi ?\n\n',
          'event: victory-conditions-success\ndata: \n\n',
          'data: message possible dans le mm chunk que isValid Event\n\n',
          'data: done\n\n',
        ];
        const readable = Readable.from(input);
        const transform = getTransform(streamCapture, true);
        let result = '';

        // when
        readable.pipe(transform);
        transform.on('data', (str) => (result = result + str));
        await finished(transform);

        // then
        expect(result).to.equal(
          'data: Coucou les amis comment ça va ?\n\ndata: Et toi ?\n\nevent: victory-conditions-success\ndata: \n\ndata: message possible dans le mm chunk que isValid Event\n\ndata: done\n\nevent: input-tokens-3000\ndata: \n\nevent: output-tokens-5000\ndata: \n\n',
        );
      });
    });

    context('when debugData is disabled', function () {
      it('should return a Transform that is basically a passthrough', async function () {
        // given
        const input = [
          'data: Coucou les amis comment ça va ?\n\n',
          'data: Et toi ?\n\n',
          'event: victory-conditions-success\ndata: \n\n',
          'data: message possible dans le mm chunk que isValid Event\n\n',
          'data: done\n\n',
        ];
        const readable = Readable.from(input);
        const transform = getTransform(streamCapture, false);
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
    });
  });
});
