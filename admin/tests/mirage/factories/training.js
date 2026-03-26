import { Factory, trait } from 'miragejs';

import { createLearningContent } from '../helpers/create-learning-content';

export default Factory.extend({
  title() {
    return 'Un contenu très formatif';
  },

  locales() {
    return ['fr-fr'];
  },

  withFramework: trait({
    afterCreate(training, server) {
      createLearningContent(server);
    },
  }),
});
