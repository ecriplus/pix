import { PoleEmploiPayload } from '../../infrastructure/externals/pole-emploi/PoleEmploiPayload.js';
import { PoleEmploiSending } from '../models/PoleEmploiSending.js';

const sendStartedParticipationResultsToPoleEmploi = async ({
  campaignParticipationId,
  campaignParticipationRepository,
  campaignRepository,
  organizationRepository,
  poleEmploiSendingRepository,
  targetProfileRepository,
  userRepository,
}) => {
  const participation = await campaignParticipationRepository.get(campaignParticipationId);
  const campaign = await campaignRepository.get(participation.campaignId);
  const organization = await organizationRepository.get(campaign.organizationId);

  if (campaign.isAssessment && organization.isPoleEmploi) {
    const user = await userRepository.get(participation.userId);
    const targetProfile = await targetProfileRepository.get(campaign.targetProfileId);
    const payload = PoleEmploiPayload.buildForParticipationStarted({
      user,
      campaign,
      targetProfile,
      participation,
    });

    const poleEmploiSending = PoleEmploiSending.buildForParticipationStarted({
      campaignParticipationId,
      payload: payload.toString(),
    });

    await poleEmploiSendingRepository.create({ poleEmploiSending });
  }
};

export { sendStartedParticipationResultsToPoleEmploi };
