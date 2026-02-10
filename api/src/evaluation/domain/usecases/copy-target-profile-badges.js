export async function copyTargetProfileBadges({
  originTargetProfileId,
  destinationTargetProfileId,
  badgeRepository,
  badgeCriteriaRepository,
}) {
  const targetProfileBadgesToCopy = await badgeRepository.findAllByTargetProfileId(originTargetProfileId);

  for (const badge of targetProfileBadgesToCopy) {
    const clonedBadge = badge.clone(destinationTargetProfileId);
    const savedBadge = await badgeRepository.save(clonedBadge);

    const badgeCriteriaToCopy = await badgeCriteriaRepository.findAllByBadgeId(badge.id);
    if (badgeCriteriaToCopy.length > 0)
      await copyBadgeCriteria({ badgeCriteriaToCopy, savedBadge, badgeCriteriaRepository });
  }
}

const copyBadgeCriteria = async ({ badgeCriteriaToCopy, savedBadge, badgeCriteriaRepository }) => {
  const badgeCriterion = badgeCriteriaToCopy.map((badgeCriterionToCopy) => {
    badgeCriterionToCopy.badgeId = savedBadge.id;
    return badgeCriterionToCopy;
  });

  return await badgeCriteriaRepository.saveAll(badgeCriterion);
};
