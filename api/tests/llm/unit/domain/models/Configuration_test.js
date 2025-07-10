import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Unit | Domain | Models | Configuration', function () {
  describe('simple property getters', function () {
    it('should return property values', function () {
      // given
      const configuration = new Configuration({
        id: 'some-config-id',
        historySize: 123,
        inputMaxChars: 456,
        inputMaxPrompts: 789,
        attachmentName: 'some-attachment-name',
        attachmentContext: 'some-attachment-context',
      });

      // then
      expect(configuration).to.have.property('id', 'some-config-id');
      expect(configuration).to.have.property('historySize', 123);
      expect(configuration).to.have.property('inputMaxChars', 456);
      expect(configuration).to.have.property('attachmentName', 'some-attachment-name');
      expect(configuration).to.have.property('attachmentContext', 'some-attachment-context');
    });
  });

  describe('#get inputMaxPrompts', function () {
    context('when configuration has no attachment', function () {
      it('should return the inputMaxPrompts of the Configuration', function () {
        // given
        const configuration = new Configuration({
          id: 'some-config-id',
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
          attachmentName: null,
          attachmentContext: null,
        });

        // then
        expect(configuration).to.have.property('inputMaxPrompts', 789);
      });
    });

    context('when configuration has an attachment', function () {
      it('should return the inputMaxPrompts of the Configuration minus one', function () {
        // given
        const configuration = new Configuration({
          id: 'some-config-id',
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
          attachmentName: 'some-attachment-name',
          attachmentContext: 'some-attachment-context',
        });

        // then
        expect(configuration).to.have.property('inputMaxPrompts', 788);
      });
    });
  });

  describe('#get hasAttachment', function () {
    context('when attachmentName is not empty', function () {
      it('should return true', function () {
        // given
        const configuration = new Configuration({
          id: 'some-config-id',
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
          attachmentName: 'some-attachment-name',
          attachmentContext: 'some-attachment-context',
        });

        // then
        expect(configuration).to.have.property('hasAttachment', true);
      });
    });

    context('when attachmentName is empty', function () {
      it('should return false', function () {
        // given
        const configuration = new Configuration({
          id: 'some-config-id',
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
          attachmentName: null,
          attachmentContext: null,
        });

        // then
        expect(configuration).to.have.property('hasAttachment', false);
      });
    });
  });

  describe('#toDTO', function () {
    it('should return the DTO version of the Configuration model', function () {
      // given
      const configuration = new Configuration({
        id: 'some-config-id',
        historySize: 123,
        inputMaxChars: 456,
        inputMaxPrompts: 789,
        attachmentName: 'some-attachment-name',
        attachmentContext: 'some-attachment-context',
      });

      // when
      const dto = configuration.toDTO();

      // then
      expect(dto).to.deep.equal({
        id: 'some-config-id',
        historySize: 123,
        inputMaxChars: 456,
        inputMaxPrompts: 789,
        attachmentName: 'some-attachment-name',
        attachmentContext: 'some-attachment-context',
      });
    });
  });

  describe('#fromDTO', function () {
    it('should return the DTO version of the Configuration model', function () {
      // given
      const dto = {
        id: 'some-config-id',
        historySize: 123,
        inputMaxChars: 456,
        inputMaxPrompts: 789,
        attachmentName: 'some-attachment-name',
        attachmentContext: 'some-attachment-context',
      };

      // when
      const configuration = Configuration.fromDTO(dto);

      // then
      expect(configuration).to.deepEqualInstance(
        new Configuration({
          id: 'some-config-id',
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
          attachmentName: 'some-attachment-name',
          attachmentContext: 'some-attachment-context',
        }),
      );
    });
  });
});
