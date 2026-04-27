import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import CourseCard from 'pix-orga/components/courses/course-card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Courses::CourseCard', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('for a "targetProfile" type course', function () {
    test('it shows the course name as a heading', async function (assert) {
      const course = { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5 };

      const screen = await render(<template><CourseCard @course={{course}} /></template>);

      assert.dom(screen.getByRole('heading', { name: 'Ma super formation' })).exists();
    });

    test('it shows the "Parcours" type tag', async function (assert) {
      const course = { name: 'Ma formation', type: 'targetProfile', nbTubes: 3 };

      const screen = await render(<template><CourseCard @course={{course}} /></template>);

      assert.dom(screen.getByText(t('pages.catalogue.card.tag.target-profile'))).exists();
    });

    test('it shows the number of tubes', async function (assert) {
      const course = { name: 'Ma formation', type: 'targetProfile', nbTubes: 3 };

      const screen = await render(<template><CourseCard @course={{course}} /></template>);

      assert.dom(screen.getByText(t('pages.catalogue.card.tubes-count', { count: 3 }))).exists();
    });

    module('course category', function () {
      test('it shows the category label when a category is set', async function (assert) {
        const course = { name: 'Ma formation', type: 'targetProfile', nbTubes: 1, category: 'COMPETENCES' };

        const screen = await render(<template><CourseCard @course={{course}} /></template>);

        assert.dom(screen.getByText(t('pages.campaign-creation.tags.COMPETENCES'))).exists();
      });

      test('it shows no category label when the course has no category', async function (assert) {
        const course = { name: 'Ma formation', type: 'targetProfile', nbTubes: 1, category: null };

        const screen = await render(<template><CourseCard @course={{course}} /></template>);

        assert.notOk(screen.queryByText(t('pages.campaign-creation.tags.COMPETENCES')));
      });
    });
  });

  module('for a "blueprint" type course', function () {
    test('it shows the "Parcours apprenant" type tag', async function (assert) {
      const course = { name: 'Mon parcours', type: 'blueprint', nbModules: 4 };

      const screen = await render(<template><CourseCard @course={{course}} /></template>);
      assert.dom(screen.getByText(t('pages.catalogue.card.tag.blueprint'))).exists();
    });

    test('it shows the number of modules', async function (assert) {
      const course = { name: 'Mon parcours', type: 'blueprint', nbModules: 4 };

      const screen = await render(<template><CourseCard @course={{course}} /></template>);

      assert.dom(screen.getByText(t('pages.catalogue.card.modules-count', { count: 4 }))).exists();
    });
  });

  module('simplified access', function () {
    test('it shows the simplified access mention when enabled', async function (assert) {
      const course = { name: 'Ma formation', type: 'targetProfile', nbTubes: 2, isSimplifiedAccess: true };

      const screen = await render(<template><CourseCard @course={{course}} /></template>);
      assert.dom(screen.getByText(t('pages.catalogue.card.simplified-access'))).exists();
    });

    test('it does not show the simplified access mention when disabled', async function (assert) {
      const course = { name: 'Ma formation', type: 'targetProfile', nbTubes: 2, isSimplifiedAccess: false };

      const screen = await render(<template><CourseCard @course={{course}} /></template>);

      assert.notOk(screen.queryByText(t('pages.catalogue.card.simplified-access')));
    });
  });
});
