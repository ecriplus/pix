import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { CombinedCourseStatuses } from '../../../../models/combined-course.js';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering.js';

module('Integration | Component | combined course', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('in all cases', function () {
    test('should display Combinix title', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'NOT_STARTED',
        code: 'COMBINIX9',
        name: 'Combinix',
      });

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByRole('heading', { name: 'Combinix' }));
    });
    test('should display description on course if they exist', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.NOT_STARTED,
        code: 'COMBINIX9',
        description: 'Le but de ma quête',
      });

      this.setProperties({ combinedCourse });
      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);
      assert.ok(screen.getByText('Le but de ma quête'));
    });
    test('should display exit button', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      this.owner.lookup('service:router');

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: 'NOT_STARTED',
        code: 'COMBINIX9',
        name: 'Combinix',
      });

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      const link = screen.getByRole('link', { name: t('common.actions.quit') });
      assert.dom(link).hasAttribute('href', '/');
    });
  });

  module('when there is a formation item', function () {
    test('should display formation item', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 'formation_1_2',
        reference: 2,
        type: 'FORMATION',
        isLocked: true,
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.NOT_STARTED,
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
      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.NOT_STARTED,
        code: 'COMBINIX9',
      });

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
      const router = this.owner.lookup('service:router');

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.NOT_STARTED,
        code: 'COMBINIX9',
      });
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        reference: 'CAMPAIGN1',
        title: 'my campaign',
        type: 'CAMPAIGN',
      });
      combinedCourse.items.push(combinedCourseItem);

      sinon.stub(combinedCourse, 'reload').callsFake(() => {
        combinedCourse.status = 'STARTED';
      });
      this.setProperties({ combinedCourse });
      sinon.stub(store, 'adapterFor');
      sinon.stub(router, 'transitionTo');

      store.adapterFor.withArgs('combined-course').returns({ start: sinon.stub().withArgs('COMBINIX9').resolves() });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);
      await click(screen.getByRole('button', { name: t('pages.combined-courses.content.start-button') }));

      // then
      assert.ok(router.transitionTo.calledWith('campaigns', 'CAMPAIGN1'));
    });

    test('should display diagnostic campaign with link', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'ma campagne',
        reference: 'ABCDIAG1',
        type: 'CAMPAIGN',
        isCompleted: false,
        isLocked: false,
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.NOT_STARTED,
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText('ma campagne'));
      assert.ok(screen.getByRole('link', { name: /ma campagne/ }));
      assert.ok(screen.getByText(t('pages.combined-courses.items.tagText')));
    });

    test('should display modules with no link', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'mon module',
        reference: 'mon-module',
        type: 'MODULE',
        isLocked: true,
      });

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.NOT_STARTED,
        code: 'COMBINIX9',
      });

      combinedCourse.items.push(combinedCourseItem);

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByText('mon module'));
      assert.notOk(screen.queryByRole('link', { name: /mon module/ }));
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
        status: CombinedCourseStatuses.STARTED,
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
        screen.getByRole('link', { name: /ma campagne/ }).getAttribute('href'),
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
        status: CombinedCourseStatuses.STARTED,
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
        screen.getByRole('link', { name: /mon module/ }).getAttribute('href'),
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
        status: CombinedCourseStatuses.STARTED,
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
  test('should display resume button with next item link', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const router = this.owner.lookup('service:router');

    sinon.stub(router, 'transitionTo');

    const campaignCombinedCourseItem = store.createRecord('combined-course-item', {
      id: 1,
      title: 'ma campagne',
      reference: 'ABCDIAG1',
      type: 'CAMPAIGN',
      isCompleted: true,
    });

    const moduleCombinedCourseItem = store.createRecord('combined-course-item', {
      id: 2,
      title: 'mon module',
      reference: 'mon-module',
      type: 'MODULE',
      redirection: 'une+url+chiffree',
      isCompleted: false,
    });

    const combinedCourse = store.createRecord('combined-course', {
      id: 1,
      status: CombinedCourseStatuses.STARTED,
      code: 'COMBINIX9',
    });

    combinedCourse.items.push(campaignCombinedCourseItem, moduleCombinedCourseItem);

    this.setProperties({ combinedCourse });

    // when
    const screen = await render(hbs`
      <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

    // then
    await click(screen.getByRole('button', { name: t('pages.combined-courses.content.resume-button') }));
    assert.ok(
      router.transitionTo.calledWith('module', 'mon-module', { queryParams: { redirection: 'une+url+chiffree' } }),
    );
  });
  test('when an item is locked, its link does not exist', async function (assert) {
    const store = this.owner.lookup('service:store');

    const campaignCombinedCourseItem = store.createRecord('combined-course-item', {
      id: 1,
      title: 'ma campagne',
      reference: 'ABCDIAG1',
      type: 'CAMPAIGN',
      isCompleted: false,
      isLocked: false,
    });

    const moduleCombinedCourseItem = store.createRecord('combined-course-item', {
      id: 2,
      title: 'mon module',
      reference: 'ABCMODU1',
      type: 'MODULE',
      isCompleted: true,
      isLocked: true,
    });

    const combinedCourse = store.createRecord('combined-course', {
      id: 1,
      status: 'STARTED',
      code: 'COMBINIX9',
    });
    combinedCourse.items.push(campaignCombinedCourseItem, moduleCombinedCourseItem);
    this.setProperties({ combinedCourse });

    // when
    const screen = await render(hbs`
      <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

    // then
    assert.ok(screen.getByRole('button', { name: t('pages.combined-courses.content.resume-button') }));
    assert.notOk(screen.queryByRole('link', { name: 'mon module' }));
  });
  module('when participation is completed', function () {
    test('should display that combined course is finished', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');

      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.COMPLETED,
        code: 'COMBINIX9',
      });

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      assert.ok(screen.getByRole('heading', { name: t('pages.combined-courses.completed.title') }));
      assert.notOk(screen.queryByText(t('pages.combined-courses.items.tagText')));
    });
    test('should display survey cta', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isSurveyEnabledForCombinedCourses: true });
      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        status: CombinedCourseStatuses.COMPLETED,
        code: 'COMBINIX9',
      });

      this.setProperties({ combinedCourse });

      // when
      const screen = await render(hbs`
        <Routes::CombinedCourses @combinedCourse={{this.combinedCourse}}  />`);

      // then
      const link = screen.getByRole('link', { name: t('pages.combined-courses.completed.survey-button') });
      assert
        .dom(link)
        .hasAttribute(
          'href',
          'https://app-eu.123formbuilder.com/index.php?p=login&pactionafter=edit_fields%26id%3D86361%26startup_panel%3Deditor%26click_from%3Dyour_forms',
        );
      assert.dom(link).hasAttribute('target', '_blank');
      assert.dom(link).hasAttribute('rel', 'noopener noreferrer');
    });
  });
});
