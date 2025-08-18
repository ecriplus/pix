/**
 * Returns mastery percentage based on user
 * knowledge elements and skillIds.
 *
 * @param {KnowledgeElement[]} knowledgeElements
 * @param {string[]} skillIds
 * @param {boolean} round
 *
 * @returns {number}
 */
export const getMasteryPercentage = (knowledgeElements, skillIds, round = true) => {
  if (!skillIds.length) return 0;

  const validatedKnowledgeElements = knowledgeElements.filter(({ isValidated }) => isValidated);

  const knowledgeElementsInSkills = validatedKnowledgeElements.filter((knowledgeElement) =>
    skillIds.some((id) => String(id) === String(knowledgeElement.skillId)),
  );

  if (round) {
    return Math.round((knowledgeElementsInSkills.length * 100) / skillIds.length);
  } else {
    return (knowledgeElementsInSkills.length * 100) / skillIds.length;
  }
};
