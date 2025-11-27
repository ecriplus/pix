import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

import {
  getTransform,
  LengthPrefixedJsonDecoderStream,
} from '../../../../../../src/llm/infrastructure/streaming/transforms/length-prefixed-json-decoder-transform.js';
import { expect } from '../../../../../test-helper.js';

describe('LLM | Unit | Infrastructure | Streaming | Transforms | LengthPrefixedJsonDecoderTransform', function () {
  describe('#getTransform', function () {
    it('should return a Transform that is capable of extract objects contained in streamed data formatted as "length prefixed json"', async function () {
      // given
      const incomingChunksAsStr = [
        '14:{"message":""}',
        '25:{"truc":{"machin":"oui"}}',
        '83:{"quelquechose":"de different {\\"message\\":\\"feinte !\\"","message":"aeza\\"\\"{}()\'"}',
        '57:{"message":"\\"\\"{}()Izhoidze156:{\\"message\\":\\"troll\\"\'"}',
        '25:{"truc":{"machin":"oui"}}',
      ];
      const encoder = new TextEncoder();
      const incomingChunks = incomingChunksAsStr.map((chunk) => encoder.encode(chunk));
      const readable = Readable.from(incomingChunks);
      const transform = getTransform();
      const result = [];

      // when
      readable.pipe(transform);
      transform.on('data', (object) => result.push(object));
      await finished(transform);

      // then
      expect(result).to.deep.equal([
        { message: '' },
        { truc: { machin: 'oui' } },
        { quelquechose: 'de different {"message":"feinte !"', message: 'aeza""{}()\'' },
        { message: '""{}()Izhoidze156:{"message":"troll"\'' },
        { truc: { machin: 'oui' } },
      ]);
    });
  });

  describe('#LengthPrefixedJsonDecoderStream', function () {
    it('should create a TransformStream that is capable of extracting objects contained in streamed data formatted as "length prefixed json"', async function () {
      // given
      const incomingChunks = [
        '14:{"message":""}',
        '25:{"truc":{"machin":"oui"}}23:{"sur":"la même ligne"}',
        '83:{"quelquechose":"de different {\\"message\\":\\"feinte !\\"","message":"aeza\\"\\"{}()\'"}',
        '57:{"message":"\\"\\"{}()Izhoidze156:{\\"message\\":\\"troll\\"\'"}',
        '25:{"truc":{"machin":"oui"}}',
      ];
      const readable = ReadableStream.from(incomingChunks);
      const transform = new LengthPrefixedJsonDecoderStream();
      const result = [];
      const writable = new WritableStream({
        write(chunk) {
          result.push(chunk);
        },
      });

      // when
      await readable.pipeThrough(transform).pipeTo(writable);

      // then
      expect(result).to.deep.equal([
        { message: '' },
        { truc: { machin: 'oui' } },
        { sur: 'la même ligne' },
        { quelquechose: 'de different {"message":"feinte !"', message: 'aeza""{}()\'' },
        { message: '""{}()Izhoidze156:{"message":"troll"\'' },
        { truc: { machin: 'oui' } },
      ]);
    });
  });
});
