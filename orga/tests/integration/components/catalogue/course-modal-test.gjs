import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import CourseModal from 'pix-orga/components/catalogue/course-modal';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Catalogue::CourseModal', function (hooks) {
  setupIntlRenderingTest(hooks);
  let currentUser, store;

  const closeModal = sinon.stub();

  hooks.beforeEach(function () {
    currentUser = this.owner.lookup('service:current-user');
    store = this.owner.lookup('service:store');
  });

  module('modal display', function () {
    test('it should show the modal if isModalOpen', async function (assert) {
      // given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation' });

      // when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      // then
      assert.dom(await screen.findByRole('dialog', { name: currentCourse.name })).exists();
    });

    test('it should not show the modal if not isModalOpen', async function (assert) {
      // given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation' });

      // when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{false}} />
        </template>,
      );

      // then
      assert.dom(screen.queryByRole('dialog', { name: currentCourse.name })).doesNotExist();
    });
  });

  module('for a "targetProfile" type course', function () {
    test('it shows the course content', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', {
        name: 'Ma super formation',
        description: 'description',
      });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      // then
      assert.dom(screen.getByText(currentCourse.name)).exists();
      assert.dom(screen.getByText(currentCourse.description)).exists();
      assert.dom(screen.getByText(t('pages.catalogue.card.tag.target-profile'))).exists();
    });
  });

  module('for a "blueprint" type course', function () {
    test('it shows the course content', async function (assert) {
      //given
      const currentCourse = store.createRecord('combined-course-blueprint', {
        name: 'Ma super formation',
        description: 'description',
      });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      // then
      assert.dom(screen.getByText(currentCourse.name)).exists();
      assert.dom(screen.getByText(currentCourse.description)).exists();
      assert.dom(screen.getByText(t('pages.catalogue.card.tag.blueprint'))).exists();
    });
  });

  module('badges', function () {
    test('it shows course available badges', async function (assert) {
      //given
      const badge1 = store.createRecord('badge', { altMessage: 'altBadge1' });
      const badge2 = store.createRecord('badge', { altMessage: 'altBadge2' });
      const currentCourse = store.createRecord('target-profile-overview', {
        name: 'Ma super formation',
        badges: [badge1, badge2],
      });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      // then
      assert.dom(screen.getByRole('heading', { name: t('pages.catalogue.modal.associated-badges') })).exists();
      assert.dom(screen.getByRole('img', { name: 'altBadge1' })).exists();
      assert.dom(screen.getByRole('img', { name: 'altBadge2' })).exists();
    });

    test('it hides badges section if there are none', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', {
        name: 'Ma super formation',
        badges: [],
      });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      // // then
      assert.dom(screen.queryByRole('heading', { name: t('pages.catalogue.modal.associated-badges') })).doesNotExist();
    });
  });

  module('campaign creation page link', function () {
    test('it shows enabled campaign creation route button if enough "places"', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation' });
      sinon.stub(currentUser, 'placeStatistics').value({ hasReachedMaximumPlacesLimit: false });

      //when
      const screen = await render(
        <template><CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} /></template>,
      );
      const submitButton = await screen.getByText(t('pages.campaign-creation.target-profiles-label'));

      // // then
      assert.dom(submitButton).hasAttribute('aria-disabled', 'false');
    });

    test('it disables campaign creation route button if not enough "places"', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation' });
      sinon.stub(currentUser, 'placeStatistics').value({ hasReachedMaximumPlacesLimit: true });

      //when
      const screen = await render(
        <template><CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} /></template>,
      );
      const submitButton = await screen.getByText(t('pages.campaign-creation.target-profiles-label'));

      // then
      assert.dom(submitButton).hasAttribute('aria-disabled', 'true');
    });
  });

  module('level', function () {
    test('it shows novice level', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation', level: 2 });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      //then
      assert.dom(screen.getByText(t('pages.statistics.level.novice'), { exact: false })).exists();
    });
    test('it shows independent level', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation', level: 4 });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      //then
      assert.dom(screen.getByText(t('pages.statistics.level.independent'), { exact: false })).exists();
    });
    test('it shows advanced level', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation', level: 6 });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      //then
      assert.dom(screen.getByText(t('pages.statistics.level.advanced'), { exact: false })).exists();
    });
    test('it shows expert level', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', { name: 'Ma super formation', level: 8 });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      //then
      assert.dom(screen.getByText(t('pages.statistics.level.expert'), { exact: false })).exists();
    });
  });

  module('simplified access', function () {
    test('it shows course with simplified access label', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', {
        name: 'Ma super formation',
        isSimplifiedAccess: true,
      });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      //then
      assert
        .dom(screen.getByText(t('common.target-profile-details.simplified-access.without-account'), { exact: false }))
        .exists();
    });
    test('it shows course without simplified access label', async function (assert) {
      //given
      const currentCourse = store.createRecord('target-profile-overview', {
        name: 'Ma super formation',
        isSimplifiedAccess: false,
      });

      //when
      const screen = await render(
        <template>
          <CourseModal @currentCourse={{currentCourse}} @closeModal={{closeModal}} @isModalOpen={{true}} />
        </template>,
      );

      //then
      assert
        .dom(screen.getByText(t('common.target-profile-details.simplified-access.with-account'), { exact: false }))
        .exists();
    });
  });
});
