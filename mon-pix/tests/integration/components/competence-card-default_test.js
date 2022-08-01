import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | competence-card-default', function () {
  setupIntlRenderingTest(hooks);

  module('Component rendering', function (hooks) {
    let area;

    hooks.beforeEach(function () {
      area = EmberObject.create({
        code: 1,
        color: 'jaffa',
      });
    });

    test('should render component', async function (assert) {
      // given
      const scorecard = { area };
      this.set('scorecard', scorecard);

      // when
      await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

      // then
      assert.dom(find('.competence-card')).exists();
    });

    test('should display the competence card header with scorecard color', async function (assert) {
      // given
      const scorecard = { area };
      this.set('scorecard', scorecard);

      // when
      await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

      // then
      assert.dom(find('.competence-card__wrapper').getAttribute('class')).hasValue('competence-card__wrapper--jaffa');
    });

    test('should display the area name', async function (assert) {
      // given
      const scorecard = { area: EmberObject.create({ code: 1, title: 'First Area' }) };
      this.set('scorecard', scorecard);

      // when
      await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

      // then
      assert.equal(find('.competence-card__area-name').textContent, scorecard.area.title);
    });

    test('should display the competence name', async function (assert) {
      // given
      const scorecard = { area, name: 'First Competence' };
      this.set('scorecard', scorecard);

      // when
      await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

      // then
      assert.equal(find('.competence-card__competence-name').textContent, scorecard.name);
    });

    test('should display the level', async function (assert) {
      // given
      const scorecard = { area, level: 3 };
      this.set('scorecard', scorecard);

      // when
      await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

      // then
      assert.equal(find('.score-label').textContent, 'niveau');
      assert.equal(find('.score-value').textContent, scorecard.level.toString());
    });

    module('when user can start the competence', async function () {
      test('should show the button "Commencer"', async function (assert) {
        // given
        const scorecard = { area, level: 3, isFinished: false, isStarted: false };
        this.set('scorecard', scorecard);

        // when
        await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

        // then
        assert.dom(find('.competence-card__button').textContent).hasText('Commencer');
      });
    });

    module('when user can continue the competence', async function () {
      test('should show the button "Reprendre"', async function (assert) {
        // given
        const scorecard = { area, level: 3, isFinished: false, isStarted: true };
        this.set('scorecard', scorecard);

        // when
        await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

        // then
        assert.dom(find('.competence-card__button').textContent).hasText('Reprendre');
      });

      module('and the user has reached the maximum level', function () {
        hooks.beforeEach(async function () {
          // given
          const scorecard = { area, isFinishedWithMaxLevel: false, isStarted: true };
          this.set('scorecard', scorecard);

          // when
          await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);
        });

        test('should not show congrats design', function (assert) {
          // then
          assert.dom(find('.competence-card__congrats')).doesNotExist();
        });

        test('should not show congrats message in the footer', function (assert) {
          // then
          assert.dom(find('.competence-card-footer__congrats-message')).doesNotExist();
        });
      });
    });

    module('when user has finished the competence', async function () {
      test('should show the improving button when there is no remaining days before improving', async function (assert) {
        // given
        const scorecard = { area, level: 3, isFinished: true, isStarted: false, remainingDaysBeforeImproving: 0 };
        this.set('scorecard', scorecard);

        // when
        await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

        // then
        assert.dom(find('.competence-card__button')).exists();
        assert.dom(find('.competence-card__button').textContent).hasText('Retenter');
      });

      test('should show the improving countdown when there is some remaining days before improving', async function (assert) {
        // given
        const scorecard = { area, level: 3, isFinished: true, isStarted: false, remainingDaysBeforeImproving: 3 };
        this.set('scorecard', scorecard);

        // when
        await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);

        // then
        assert.dom(find('.competence-card-interactions__improvement-countdown')).exists();
        assert.dom(find('.competence-card-interactions__improvement-countdown').textContent).hasText('3 jours');
      });

      module('and the user has reached the maximum level', function () {
        hooks.beforeEach(async function () {
          // given
          const scorecard = { area, isFinishedWithMaxLevel: true };
          this.set('scorecard', scorecard);

          // when
          await render(hbs`<CompetenceCardDefault @scorecard={{this.scorecard}} />`);
        });

        test('should show congrats design', function (assert) {
          // then
          assert.dom(find('.competence-card__congrats')).exists();
        });

        test('should show congrats message in the footer', function (assert) {
          // then
          assert.dom(find('.competence-card__congrats-message')).exists();
        });
      });
    });
  });
});
