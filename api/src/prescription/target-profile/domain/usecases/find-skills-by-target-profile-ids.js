const findSkillsByTargetProfileIds = async function ({ targetProfileIds, targetProfileRepository }) {
  return targetProfileRepository.findSkillsByIds({ targetProfileIds });
};

export { findSkillsByTargetProfileIds };
