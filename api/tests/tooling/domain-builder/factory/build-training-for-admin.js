import { Training } from '../../../../src/devcomp/domain/models/Training.js';
import { TrainingForAdmin } from '../../../../src/devcomp/domain/read-models/TrainingForAdmin.js';

const buildTrainingForAdmin = function ({
  id = 'training1',
  title = 'Training 1',
  internalTitle = 'Training 1 internal title',
  link = 'https://example.net',
  type = 'webinar',
  duration = {
    hours: 5,
  },
  locales = ['fr-fr'],
  targetProfileIds = [1],
  editorName = 'Ministère education nationale',
  editorLogoUrl = 'https://assets.pix.org/contenu-formatif/editeur/editor_logo_url.svg',
  deliveryMode = Training.modes.REMOTE,
  registrationRequired = false,
  program = 'Program name',
  objectives = ['Objectif 1', 'Objectif 2', 'Objectif 3', 'Objectif 4'],
  description = 'une jolie description',
  trainingTriggers,
  isDisabled = false,
} = {}) {
  return new TrainingForAdmin({
    id,
    title,
    internalTitle,
    link,
    type,
    duration,
    locales,
    targetProfileIds,
    editorName,
    editorLogoUrl,
    trainingTriggers,
    deliveryMode,
    registrationRequired,
    program,
    objectives,
    description,
    isDisabled,
  });
};

export { buildTrainingForAdmin };
