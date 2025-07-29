import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Unit | Domain | Models | Configuration', function () {
  describe('property getters', function () {
    context('when dto has attachment', function () {
      it('return property values', function () {
        // given
        const configuration = new Configuration({
          llm: {
            historySize: 123,
          },
          challenge: {
            inputMaxChars: 456,
            inputMaxPrompts: 789,
            context: 'modulix',
          },
          attachment: {
            name: 'some-attachment-name',
            context: 'some-attachment-context',
          },
        });

        // then
        expect(configuration).to.contain({
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 788,
          hasAttachment: true,
          attachmentName: 'some-attachment-name',
          attachmentContext: 'some-attachment-context',
          context: 'modulix',
        });
      });
    });

    context('when dto has no attachment', function () {
      it('returns undefined for attachment properties', function () {
        // given
        const configuration = new Configuration({
          llm: {
            historySize: 123,
          },
          challenge: {
            inputMaxChars: 456,
            inputMaxPrompts: 789,
          },
        });

        // then
        expect(configuration).to.contain({
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
          hasAttachment: false,
          attachmentName: undefined,
          attachmentContext: undefined,
          context: undefined,
        });
      });
    });
  });

  describe('#toDTO', function () {
    it('returns the dto', function () {
      // given
      const dto = Symbol('dto');
      const configuration = new Configuration(dto);

      // when
      const actualDto = configuration.toDTO();

      // then
      expect(actualDto).to.equal(dto);
    });
  });

  describe('#fromDTO', function () {
    it('returns Configuration model', function () {
      // given
      const dto = {
        llm: {
          historySize: 123,
        },
        challenge: {
          inputMaxChars: 456,
          inputMaxPrompts: 789,
          context: 'evaluation',
        },
        attachment: {
          name: 'some-attachment-name',
          context: 'some-attachment-context',
        },
      };

      // when
      const configuration = Configuration.fromDTO(dto);

      // then
      expect(configuration).to.be.instanceOf(Configuration);
      expect(configuration).to.contain({
        historySize: 123,
        inputMaxChars: 456,
        inputMaxPrompts: 788,
        hasAttachment: true,
        attachmentName: 'some-attachment-name',
        attachmentContext: 'some-attachment-context',
        context: 'evaluation',
      });
    });
  });
});
