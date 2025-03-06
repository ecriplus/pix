import { TARGET_PROFILE_COPY_NAME_PREFIX } from '../constants.js';
import { validate } from '../validators/creation-command-validation.js';

const DEFAULT_IMAGE_URL = 'https://images.pix.fr/profil-cible/Illu_GEN.svg';

class TargetProfileForCreation {
  constructor({
    name,
    internalName,
    category,
    description,
    comment,
    imageUrl,
    ownerOrganizationId,
    tubes,
    areKnowledgeElementsResettable,
  }) {
    this.name = name;
    this.internalName = internalName;
    this.category = category;
    this.description = description;
    this.comment = comment;
    this.imageUrl = imageUrl;
    this.ownerOrganizationId = ownerOrganizationId;
    this.tubes = tubes;
    this.areKnowledgeElementsResettable = areKnowledgeElementsResettable;
  }

  static fromCreationCommand(creationCommand) {
    validate(creationCommand);
    return new TargetProfileForCreation({
      name: creationCommand.name,
      internalName: creationCommand.internalName,
      category: creationCommand.category,
      description: creationCommand.description,
      comment: creationCommand.comment,
      imageUrl: creationCommand.imageUrl || DEFAULT_IMAGE_URL,
      ownerOrganizationId: creationCommand.ownerOrganizationId,
      tubes: creationCommand.tubes,
      areKnowledgeElementsResettable: creationCommand.areKnowledgeElementsResettable,
    });
  }

  static copyTargetProfile(targetProfileToCopy) {
    const copiedTargetProfileName = TARGET_PROFILE_COPY_NAME_PREFIX + targetProfileToCopy.name;
    const copiedTargetProfileInternalName = TARGET_PROFILE_COPY_NAME_PREFIX + targetProfileToCopy.internalName;

    return new TargetProfileForCreation({
      name: copiedTargetProfileName,
      internalName: copiedTargetProfileInternalName,
      category: targetProfileToCopy.category,
      description: targetProfileToCopy.description,
      comment: targetProfileToCopy.comment,
      imageUrl: targetProfileToCopy.imageUrl || DEFAULT_IMAGE_URL,
      ownerOrganizationId: targetProfileToCopy.ownerOrganizationId,
      tubes: targetProfileToCopy.tubes,
      areKnowledgeElementsResettable: targetProfileToCopy.areKnowledgeElementsResettable,
    });
  }
}

export { TargetProfileForCreation };
