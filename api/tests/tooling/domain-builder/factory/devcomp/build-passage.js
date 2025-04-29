import { Passage } from '../../../../../src/devcomp/domain/models/Passage.js';

export const buildPassage = ({
  id = 1,
  moduleId = 'abcdef',
  userId = null,
  createdAt = new Date(),
  updatedAt = null,
  terminatedAt = null,
} = {}) => {
  return new Passage({ id, moduleId, userId, createdAt, updatedAt, terminatedAt });
};
