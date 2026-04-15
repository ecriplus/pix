import {
  CertificationCompanionLiveAlert,
  CertificationCompanionLiveAlertStatus,
} from '../../../shared/domain/models/CertificationCompanionLiveAlert.js';

/**
 * @param {object} params
 * @param {number} params.assessmentId
 * @param {import('./index.js').CertificationCompanionAlertRepository} params.certificationCompanionAlertRepository
 **/
export async function createCompanionAlert({ assessmentId, certificationCompanionAlertRepository }) {
  const companionAlert = new CertificationCompanionLiveAlert({
    assessmentId,
    status: CertificationCompanionLiveAlertStatus.ONGOING,
  });
  await certificationCompanionAlertRepository.create(companionAlert);
}
