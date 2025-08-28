import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering.js';

module('Integration | Component | combined course', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when there is a formation item', function () {
    test('should display formation item', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 'formation_1_2',
        reference: 2,
        type: 'FORMATION',
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'NOT_STARTED',
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText(t('pages.combined-courses.items.formation.title')));
      assert.ok(screen.getByText(t('pages.combined-courses.items.formation.description')));
    });
  });

  module('when participation has not been started yet', function () {
    test('should display start button', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourse = store.createRecord('combined-course', { id: 1, status: 'NOT_STARTED', code: 'COMBINIX9' });
      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByRole('button', { name: t('pages.combined-courses.content.start-button') }));
    });

    test('when clicking start button, should create quest participation', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourse = store.createRecord('combined-course', { id: 1, status: 'NOT_STARTED', code: 'COMBINIX9' });
      sinon.stub(combinedCourse, 'reload').callsFake(() => {
        combinedCourse.status = 'STARTED';
      });
      this.setProperties({ combinedCourse });
      sinon.stub(store, 'adapterFor');

      store.adapterFor.withArgs('combined-course').returns({ start: sinon.stub().withArgs('COMBINIX9').resolves() });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      await click(screen.getByRole('button', { name: t('pages.combined-courses.content.start-button') }));

      // then
      assert.notOk(screen.queryByRole('button', { name: t('pages.combined-courses.content.start-button') }));
    });

    test('should display diagnostic campaign with no link', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'ma campagne',
        reference: 'ABCDIAG1',
        type: 'CAMPAIGN',
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'NOT_STARTED',
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText('ma campagne'));
      assert.notOk(screen.queryByRole('link', { name: 'ma campagne' }));
    });

    test('should display modules with no link', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'mon module',
        reference: 'mon-module',
        type: 'MODULE',
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'NOT_STARTED',
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText('mon module'));
      assert.notOk(screen.queryByRole('link', { name: 'mon module' }));
    });
  });

  module('when participation is started', function () {
    test('should display diagnostic campaign with related link', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const router = this.owner.lookup('service:router');

      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'ma campagne',
        reference: 'ABCDIAG1',
        type: 'CAMPAIGN',
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'STARTED',
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText('ma campagne'));
      assert.strictEqual(
        screen.getByRole('link', { name: 'ma campagne' }).getAttribute('href'),
        router.urlFor('campaigns', { code: combinedCourseItem.reference }),
      );
    });
    test('should display modules with with related link', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const router = this.owner.lookup('service:router');

      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'mon module',
        reference: 'mon-module',
        type: 'MODULE',
        redirection: 'une+url+chiffree',
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'STARTED',
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText('mon module'));
      assert.strictEqual(
        screen.getByRole('link', { name: 'mon module' }).getAttribute('href'),
        router.urlFor(
          'module',
          {
            slug: combinedCourseItem.reference,
          },
          {
            queryParams: {
              redirection: combinedCourseItem.redirection,
            },
          },
        ),
      );
    });
    test('should display completed status for finished items', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'mon module',
        reference: 'mon-module',
        type: 'MODULE',
        isCompleted: true,
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'STARTED',
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);
      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
    <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText(t('pages.combined-courses.items.completed')));
    });
  });
  module('when participation is completed', function () {
    test('should display that combined course is finished', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'COMPLETED',
        code: 'COMBINIX9',
      });

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByRole('heading', { name: t('pages.combined-courses.completed.title') }));
    });
  });
});
