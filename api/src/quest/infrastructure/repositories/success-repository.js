import { Success } from '../../domain/models/Success.js';

export const find = async ({ userId, knowledgeElementsApi }) => {
  const knowledgeElements = await knowledgeElementsApi.findFilteredMostRecentByUser({ userId });
  return new Success({ knowledgeElements });
};
