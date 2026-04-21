/**
 * @typedef {import ("./index.js").CenterRepository} CenterRepository
 * @typedef {import ("./index.js").SessionRepository} SessionRepository
 * @typedef {import ("./index.js").SessionValidator} SessionValidator
 * @typedef {import ("./index.js").SessionCodeService} SessionCodeService
 */

import { AlreadyExistingEntityError } from '../../../../shared/domain/errors.js';
import { SessionEnrolment } from '../models/SessionEnrolment.js';

/**
 * @param {object} params
 * @param {CenterRepository} params.centerRepository
 * @param {SessionRepository} params.sessionRepository
 * @param {SessionValidator} params.sessionValidator
 * @param {SessionCodeService} params.sessionCodeService
 */
const createSession = async function ({
  userId,
  session,
  centerRepository,
  sessionRepository,
  sessionValidator,
  sessionCodeService,
}) {
  sessionValidator.validate(session);

  const certificationCenterId = session.certificationCenterId;

  const sessionAlreadyExists = await sessionRepository.isSessionExistingByCertificationCenterId({
    address: session.address,
    room: session.room,
    date: session.date,
    time: session.time,
    certificationCenterId,
  });
  if (sessionAlreadyExists) {
    throw new AlreadyExistingEntityError('Une session avec les mêmes informations existe déjà.');
  }

  const accessCode = sessionCodeService.getNewSessionCode();
  const { name: certificationCenterName } = await centerRepository.getById({
    id: certificationCenterId,
  });

  const domainSession = new SessionEnrolment({
    ...session,
    accessCode,
    certificationCenter: certificationCenterName,
    certificationCandidates: [],
    createdBy: userId,
  });

  return sessionRepository.save({ session: domainSession });
};

export { createSession };
