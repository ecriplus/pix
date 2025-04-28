import {
  CREATE_PASSAGE_SEQUENCE_NUMBER,
  passageController,
  TERMINATE_PASSAGE_SEQUENCE_NUMBER,
} from '../../../../../src/devcomp/application/passages/controller.js';
import { requestResponseUtils } from '../../../../../src/shared/infrastructure/utils/request-response-utils.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Devcomp | Application | Passages | Controller', function () {
  describe('#create', function () {
    it('should call createPassage and recordPassageEvents use-cases and return serialized passage', async function () {
      // given
      const serializedPassage = Symbol('serialized modules');
      const moduleSlug = Symbol('module-slug');
      const passage = {
        id: Symbol('passageId'),
      };
      const sequenceNumber = CREATE_PASSAGE_SEQUENCE_NUMBER;
      const userId = Symbol('user-id');
      const passageSerializer = {
        serialize: sinon.stub(),
      };
      passageSerializer.serialize.withArgs(passage).returns(serializedPassage);
      const hStub = {
        response: sinon.stub(),
      };
      const created = sinon.stub();
      hStub.response.withArgs(serializedPassage).returns({ created });

      const request = { payload: { data: { attributes: { 'module-id': moduleSlug } } } };

      const extractUserIdFromRequestStub = sinon.stub(requestResponseUtils, 'extractUserIdFromRequest');
      extractUserIdFromRequestStub.withArgs(request).returns(userId);
      const requestTimestamp = new Date('2025-01-01').getTime();
      const extractTimestampStub = sinon
        .stub(requestResponseUtils, 'extractTimestampFromRequest')
        .returns(requestTimestamp);

      const passageStartedEvent = {
        occurredAt: new Date(requestTimestamp),
        passageId: passage.id,
        sequenceNumber,
        contentHash: 'NOT_IMPLEMENTED',
        type: 'PASSAGE_STARTED',
      };

      const usecases = {
        createPassage: sinon.stub(),
        recordPassageEvents: sinon.stub(),
      };
      usecases.createPassage.withArgs({ moduleSlug, userId }).returns(passage);

      // when
      await passageController.create({ payload: { data: { attributes: { 'module-id': moduleSlug } } } }, hStub, {
        passageSerializer,
        usecases,
      });

      // then
      expect(created).to.have.been.called;
      expect(extractTimestampStub).to.have.been.calledOnce;
      expect(usecases.recordPassageEvents).to.have.been.calledOnceWith({ events: [passageStartedEvent] });
    });
  });

  describe('#verifyAndSaveAnswer', function () {
    it('should call verifyAndSave use-case and return serialized element-answer', async function () {
      // given
      const passageId = Symbol('passage-id');
      const elementId = Symbol('element-id');
      const userResponse = Symbol('user-response');
      const uselessField = Symbol('useless-field');

      const createdElementAnswer = Symbol('created element-answer');
      const usecases = {
        verifyAndSaveAnswer: sinon.stub(),
      };
      usecases.verifyAndSaveAnswer.withArgs({ passageId, elementId, userResponse }).resolves(createdElementAnswer);

      const hStub = {
        response: sinon.stub(),
      };

      const serializedElementAnswer = Symbol('serialized element-answer');

      const elementAnswerSerializer = {
        serialize: sinon.stub(),
      };
      elementAnswerSerializer.serialize.withArgs(createdElementAnswer).returns(serializedElementAnswer);

      const createdStub = sinon.stub();
      hStub.response.withArgs(serializedElementAnswer).returns({ created: createdStub });
      createdStub.returns(serializedElementAnswer);

      // when
      const result = await passageController.verifyAndSaveAnswer(
        {
          params: { passageId },
          payload: { data: { attributes: { 'element-id': elementId, 'user-response': userResponse, uselessField } } },
        },
        hStub,
        {
          usecases,
          elementAnswerSerializer,
        },
      );

      // then
      expect(result).to.equal(serializedElementAnswer);
    });
  });

  describe('#terminate', function () {
    it('should call terminate use-case and return serialized passage', async function () {
      // given
      const requestTimestamp = new Date('2025-01-01').getTime();
      const serializedPassage = Symbol('serialized modules');
      const passageId = Symbol('passage-id');
      const sequenceNumber = TERMINATE_PASSAGE_SEQUENCE_NUMBER;
      const passage = Symbol('passage');
      const extractTimestampStub = sinon
        .stub(requestResponseUtils, 'extractTimestampFromRequest')
        .returns(requestTimestamp);
      const usecases = {
        terminatePassage: sinon.stub(),
      };
      usecases.terminatePassage
        .withArgs({ passageId, sequenceNumber, occurredAt: new Date(requestTimestamp) })
        .returns(passage);
      const passageSerializer = {
        serialize: sinon.stub(),
      };
      passageSerializer.serialize.withArgs(passage).returns(serializedPassage);

      // when
      const returned = await passageController.terminate({ params: { passageId } }, null, {
        passageSerializer,
        usecases,
      });

      // then
      expect(returned).to.deep.equal(serializedPassage);
      expect(extractTimestampStub).to.have.been.calledOnce;
    });
  });
});
