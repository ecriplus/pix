const outdateTargetProfile = async function ({
  id,
  targetProfileAdministrationRepository,
  targetProfileBondRepository,
}) {
  await targetProfileBondRepository.deleteByTargetProfileId(id);
  await targetProfileAdministrationRepository.update({ id, outdated: true });
};

export { outdateTargetProfile };
