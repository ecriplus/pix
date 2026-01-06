import { DEVCOMP_BASE_TRAINING_ID, PIX_EDU_SMALL_TARGET_PROFILE_ID } from './constants.js';

export function buildTrainings(databaseBuilder) {
  let trainingId = DEVCOMP_BASE_TRAINING_ID;
  const frTrainingId1 = databaseBuilder.factory.buildTraining({
    id: trainingId++,
    title: 'Apprendre à manger un croissant comme les français',
    internalTitle: 'Apprendre à manger un croissant comme les français',
    locale: 'fr',
  }).id;

  databaseBuilder.factory.buildTargetProfileTraining({
    targetProfileId: PIX_EDU_SMALL_TARGET_PROFILE_ID,
    trainingId: frTrainingId1,
  });

  const frTrainingTriggerId = databaseBuilder.factory.buildTrainingTrigger({
    trainingId: frTrainingId1,
    threshold: 0,
    type: 'prerequisite',
  }).id;

  databaseBuilder.factory.buildTrainingTriggerTube({
    trainingTriggerId: frTrainingTriggerId,
    tubeId: 'tube1NLpOetQhutFlA',
    level: 2,
  });

  const frTrainingId2 = databaseBuilder.factory.buildTraining({
    id: trainingId++,
    title: 'Apprendre à faire du snow dans Paris à Montmartre quand il a beaucoup neigé',
    internalTitle: 'Apprendre à faire du snow dans Paris à Montmartre quand il a beaucoup neigé',
    link: '/modules/6a68bf32/bac-a-sable/details',
    duration: '00:10:00',
    editorName: 'Pix',
    editorLogoUrl: 'https://assets.pix.org/contenu-formatif/editeur/pix-logo.svg',
    type: 'modulix',
    locale: 'fr',
  }).id;

  databaseBuilder.factory.buildTargetProfileTraining({
    targetProfileId: PIX_EDU_SMALL_TARGET_PROFILE_ID,
    trainingId: frTrainingId2,
  });

  const frTrainingTriggerId2 = databaseBuilder.factory.buildTrainingTrigger({
    trainingId: frTrainingId2,
    threshold: 0,
    type: 'prerequisite',
  }).id;

  databaseBuilder.factory.buildTrainingTriggerTube({
    trainingTriggerId: frTrainingTriggerId2,
    tubeId: 'tube1NLpOetQhutFlA',
    level: 2,
  });

  const frTrainingId3 = databaseBuilder.factory.buildTraining({
    id: trainingId++,
    title: 'Apprendre à faire de la frangipane pour régaler ses convives',
    internalTitle: 'Apprendre à faire de la frangipane pour régaler ses convives',
    link: '/modules/6a68bf32/bac-a-sable/details',
    duration: '00:10:00',
    editorName: 'Pix',
    editorLogoUrl: 'https://assets.pix.org/contenu-formatif/editeur/pix-logo.svg',
    type: 'modulix',
    locale: 'fr',
  }).id;

  databaseBuilder.factory.buildTargetProfileTraining({
    targetProfileId: PIX_EDU_SMALL_TARGET_PROFILE_ID,
    trainingId: frTrainingId3,
  });

  const frTrainingTriggerId3 = databaseBuilder.factory.buildTrainingTrigger({
    trainingId: frTrainingId3,
    threshold: 0,
    type: 'prerequisite',
  }).id;

  databaseBuilder.factory.buildTrainingTriggerTube({
    trainingTriggerId: frTrainingTriggerId3,
    tubeId: 'tube1NLpOetQhutFlA',
    level: 2,
  });

  const frFrTrainingId1 = databaseBuilder.factory.buildTraining({
    id: trainingId++,
    title: 'Apprendre à peindre comme Monet',
    internalTitle: 'Apprendre à peindre comme Monet',
    locale: 'fr-fr',
  }).id;

  databaseBuilder.factory.buildTargetProfileTraining({
    targetProfileId: PIX_EDU_SMALL_TARGET_PROFILE_ID,
    trainingId: frFrTrainingId1,
  });

  const frFrTrainingTriggerId1 = databaseBuilder.factory.buildTrainingTrigger({
    trainingId: frFrTrainingId1,
    threshold: 0,
    type: 'prerequisite',
  }).id;

  databaseBuilder.factory.buildTrainingTriggerTube({
    trainingTriggerId: frFrTrainingTriggerId1,
    tubeId: 'tube1NLpOetQhutFlA',
    level: 2,
  });

  const frFrTrainingId2 = databaseBuilder.factory.buildTraining({
    id: trainingId++,
    title: 'Bac à sable Pix',
    internalTitle: 'Bac à sable Pix',
    link: '/modules/6a68bf32/bac-a-sable/details',
    duration: '00:10:00',
    editorName: 'Pix',
    editorLogoUrl: 'https://assets.pix.org/contenu-formatif/editeur/pix-logo.svg',
    type: 'modulix',
    locale: 'fr-fr',
  }).id;

  databaseBuilder.factory.buildTargetProfileTraining({
    targetProfileId: PIX_EDU_SMALL_TARGET_PROFILE_ID,
    trainingId: frFrTrainingId2,
  });

  const frFrTrainingTriggerId2 = databaseBuilder.factory.buildTrainingTrigger({
    trainingId: frFrTrainingId2,
    threshold: 0,
    type: 'prerequisite',
  }).id;

  databaseBuilder.factory.buildTrainingTriggerTube({
    trainingTriggerId: frFrTrainingTriggerId2,
    tubeId: 'tube1NLpOetQhutFlA',
    level: 2,
  });

  const enTrainingId = databaseBuilder.factory.buildTraining({
    id: trainingId++,
    title: 'Eat a croissant like the french',
    internalTitle: 'Eat a croissant like the french',
    locale: 'en',
  }).id;

  databaseBuilder.factory.buildTargetProfileTraining({
    targetProfileId: PIX_EDU_SMALL_TARGET_PROFILE_ID,
    trainingId: enTrainingId,
  });

  const enTrainingTrigger = databaseBuilder.factory.buildTrainingTrigger({
    trainingId: enTrainingId,
    threshold: 0,
    type: 'prerequisite',
  }).id;

  databaseBuilder.factory.buildTrainingTriggerTube({
    trainingTriggerId: enTrainingTrigger,
    tubeId: 'tube1NLpOetQhutFlA',
    level: 2,
  });

  return [frTrainingId1, frTrainingId2, frTrainingId3, frFrTrainingId1, frFrTrainingId2, enTrainingId];
}
