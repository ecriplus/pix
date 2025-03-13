import { TargetProfileForCreation } from '../../../../src/prescription/target-profile/domain/models/TargetProfileForCreation.js';

const buildTargetProfileForCreation = function ({
  name = 'Profil cible super cool',
  internalName = name,
  category = 'some_category',
  description = 'description',
  comment = 'commentaire',
  imageUrl = 'image/url',
  ownerOrganizationId = null,
  tubes = [{ id: 'recTubeId', level: 8 }],
  areKnowledgeElementsResettable = false,
} = {}) {
  return new TargetProfileForCreation({
    name,
    internalName,
    category,
    description,
    comment,
    imageUrl,
    ownerOrganizationId,
    tubes,
    areKnowledgeElementsResettable,
  });
};

export { buildTargetProfileForCreation };
