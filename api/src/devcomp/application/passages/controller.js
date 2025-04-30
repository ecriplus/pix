import { requestResponseUtils } from '../../../shared/infrastructure/utils/request-response-utils.js';

const TERMINATE_PASSAGE_SEQUENCE_NUMBER = 1000;

const create = async function (request, h, { usecases, passageSerializer }) {
  const {
    'module-id': moduleSlug,
    'module-version': moduleVersion,
    'occurred-at': occurredAt,
    'sequence-number': sequenceNumber,
  } = request.payload.data.attributes;
  const userId = requestResponseUtils.extractUserIdFromRequest(request);
  const passage = await usecases.createPassage({
    moduleSlug,
    userId,
  });

  const passageStartedData = {
    contentHash: moduleVersion,
    occurredAt: new Date(occurredAt),
    passageId: passage.id,
    sequenceNumber,
    type: 'PASSAGE_STARTED',
  };

  await usecases.recordPassageEvents({ events: [passageStartedData] });

  const serializedPassage = passageSerializer.serialize(passage);
  return h.response(serializedPassage).created();
};

const verifyAndSaveAnswer = async function (request, h, { usecases, elementAnswerSerializer }) {
  const { passageId } = request.params;
  const { 'element-id': elementId, 'user-response': userResponse } = request.payload.data.attributes;
  const elementAnswer = await usecases.verifyAndSaveAnswer({ passageId, elementId, userResponse });
  const serializedElementAnswer = elementAnswerSerializer.serialize(elementAnswer);
  return h.response(serializedElementAnswer).created();
};

const terminate = async function (request, h, { usecases, passageSerializer }) {
  const sequenceNumber = TERMINATE_PASSAGE_SEQUENCE_NUMBER;
  const { passageId } = request.params;
  const requestTimestamp = requestResponseUtils.extractTimestampFromRequest(request);
  const updatedPassage = await usecases.terminatePassage({
    passageId,
    sequenceNumber,
    occurredAt: new Date(requestTimestamp),
  });
  return passageSerializer.serialize(updatedPassage);
};

const passageController = { create, verifyAndSaveAnswer, terminate };

export { passageController, TERMINATE_PASSAGE_SEQUENCE_NUMBER };
