import { BadRequestError } from '../../../shared/application/http-errors.js';
import { DomainError } from '../../../shared/domain/errors.js';
import { extractUserIdFromRequest } from '../../../shared/infrastructure/utils/request-response-utils.js';

const create = async function (request, h, { usecases, passageEventSerializer }) {
  try {
    const passageEvents = await passageEventSerializer.deserialize(request.payload);
    await usecases.recordPassageEvents({
      events: passageEvents,
      userId: extractUserIdFromRequest(request),
    });

    return h.response().code(204);
  } catch (error) {
    if (error instanceof DomainError) {
      throw new BadRequestError(error);
    }

    throw error;
  }
};

const passageEventsController = { create };

export { passageEventsController };
