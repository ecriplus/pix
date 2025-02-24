import { DataForQuest } from '../models/DataForQuest.js';

export const rewardUser = async ({
  userId,
  questRepository,
  eligibilityRepository,
  successRepository,
  rewardRepository,
  logger,
}) => {
  try {
    if (!userId) {
      return;
    }
    const quests = await questRepository.findAll();

    if (quests.length === 0) {
      return;
    }

    const eligibilities = await eligibilityRepository.find({ userId });
    const rewards = await rewardRepository.getByUserId({ userId });

    const rewardIds = rewards.map((reward) => reward.rewardId);

    for (const quest of quests) {
      const dataForQuest = eligibilities
        .map((eligibility) => new DataForQuest({ eligibility }))
        .find((dataForQuest) => quest.isEligible(dataForQuest));

      if (!dataForQuest) {
        continue;
      }

      if (rewardIds.includes(quest.rewardId)) {
        continue;
      }

      const success = await successRepository.find({ userId });
      dataForQuest.success = success;
      const userHasSucceedQuest = quest.isSuccessful(dataForQuest);

      if (userHasSucceedQuest) {
        await rewardRepository.reward({ userId, rewardId: quest.rewardId });
        rewardIds.push(quest.rewardId);
      }
    }
  } catch (error) {
    logger.error({ event: 'quest-reward' }, error);
  }
};
