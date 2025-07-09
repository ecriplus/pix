import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { expect } from '../../../../test-helper.js';

describe('LLM | Unit | Domain | Models | Configuration', function () {
  describe('#get id', function () {
    it('should return the id of the Configuration', function () {
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
      const id = configuration.id;

      // then
      expect(id).to.equal('some-config-id');
    });
  });

  describe('#get historySize', function () {
    it('should return the historySize of the Configuration', function () {
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
      const historySize = configuration.historySize;

      // then
      expect(historySize).to.equal(123);
    });
  });

  describe('#get inputMaxChars', function () {
    it('should return the inputMaxChars of the Configuration', function () {
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
      const inputMaxChars = configuration.inputMaxChars;

      // then
      expect(inputMaxChars).to.equal(456);
    });
  });

  describe('#get inputMaxPrompts', function () {
    it('should return the inputMaxPrompts of the Configuration as the original when configuration has no attachment', function () {
      // given
      const configuration = new Configuration({
        id: 'some-config-id',
        historySize: 123,
        inputMaxChars: 456,
        inputMaxPrompts: 789,
        attachmentName: null,
        attachmentContext: null,
      });

      // when
      const inputMaxPrompts = configuration.inputMaxPrompts;

      // then
      expect(inputMaxPrompts).to.equal(789);
    });

    it('should return the inputMaxPrompts of the Configuration as the original minus one when configuration has an attachment', function () {
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
      const inputMaxPrompts = configuration.inputMaxPrompts;

      // then
      expect(inputMaxPrompts).to.equal(788);
    });
  });

  describe('#get attachmentName', function () {
    it('should return the attachmentName of the Configuration', function () {
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
      const attachmentName = configuration.attachmentName;

      // then
      expect(attachmentName).to.equal('some-attachment-name');
    });
  });

  describe('#get hasAttachment', function () {
    it('should return true when attachmentName is not empty', function () {
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
      const hasAttachment = configuration.hasAttachment;

      // then
      expect(hasAttachment).to.be.true;
    });

    it('should return false when attachmentName is empty', function () {
      // given
      const configuration = new Configuration({
        id: 'some-config-id',
        historySize: 123,
        inputMaxChars: 456,
        inputMaxPrompts: 789,
        attachmentName: null,
        attachmentContext: null,
      });

      // when
      const hasAttachment = configuration.hasAttachment;

      // then
      expect(hasAttachment).to.be.false;
    });
  });

  describe('#get attachmentContext', function () {
    it('should return the attachmentContext of the Configuration', function () {
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
      const attachmentContext = configuration.attachmentContext;

      // then
      expect(attachmentContext).to.equal('some-attachment-context');
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
});
