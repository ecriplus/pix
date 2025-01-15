import * as events from '../../../../src/shared/domain/events/index.js';
import { usecases } from '../domain/usecases/index.js';

const cancel = async function (request, h, dependencies = { events }) {
  const juryId = request.auth.credentials.userId;
  const certificationCourseId = request.params.certificationCourseId;
  const certificationCancelledEvent = await usecases.cancelCertificationCourse({ certificationCourseId, juryId });
  await dependencies.events.eventDispatcher.dispatch(certificationCancelledEvent);

  return h.response().code(204);
};

const uncancel = async function (request, h) {
  const certificationCourseId = request.params.certificationCourseId;
  await usecases.uncancelCertificationCourse({ certificationCourseId });
  return h.response().code(204);
};

const cancellationController = {
  cancel,
  uncancel,
};

export { cancellationController };
