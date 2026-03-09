import { Training } from '../../../../src/devcomp/domain/models/Training.js';

const buildTraining = function ({
  id = 'training1',
  title = 'Training 1',
  internalTitle = 'Training 1 internal title',
  link = 'https://example.net',
  type = 'webinar',
  duration = {
    hours: 5,
  },
  locale = 'fr-fr',
  locales = ['fr-fr'],
  targetProfileIds = [1],
  editorName = 'Ministère education nationale',
  editorLogoUrl = 'https://assets.pix.org/contenu-formatif/editeur/editor_logo_url.svg',
  trainingTriggers,
} = {}) {
  return new Training({
    id,
    title,
    internalTitle,
    link,
    type,
    duration,
    locale,
    locales,
    targetProfileIds,
    editorName,
    editorLogoUrl,
    trainingTriggers,
  });
};

export { buildTraining };
