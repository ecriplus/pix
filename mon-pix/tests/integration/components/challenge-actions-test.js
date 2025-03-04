import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | challenge actions', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('renders', async function (assert) {
    await render(hbs`<ChallengeActions />`);
    assert.dom('.challenge-actions__group').exists();
  });

  module('when the validate answer button is clicked', function () {
    test('it should add a loading state to the button and disable the skip button', async function (assert) {
      // given
      this.set('isValidateButtonEnabled', true);
      this.set('isSkipButtonEnabled', true);
      this.set('validateActionStub', () => sinon.promise());

      // when
      const screen = await render(hbs`<ChallengeActions
  @validateAnswer={{this.validateActionStub}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
/>`);

      const validateButton = screen.getByRole('button', { name: /Je valide/ });
      await click(validateButton);

      // then
      assert.dom(validateButton).hasAttribute('disabled');
      assert.dom(screen.getByRole('button', { name: /Je passe/ })).hasAttribute('disabled');
    });

    module('on request resolution or rejection', function () {
      test('it should remove the disable states', async function (assert) {
        // given
        this.set('isValidateButtonEnabled', true);
        this.set('isSkipButtonEnabled', true);
        this.set('validateActionStub', () => sinon.promise().resolve());

        // when
        const screen = await render(hbs`<ChallengeActions
  @validateAnswer={{this.validateActionStub}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
/>`);

        const validateButton = screen.getByRole('button', { name: /Je valide/ });
        await click(validateButton);

        // then
        assert.dom(validateButton).hasNoAttribute('disabled');
        assert.dom(screen.getByRole('button', { name: /Je passe/ })).hasNoAttribute('disabled');
      });
    });
  });

  module('when the skip button is clicked', function () {
    test('it should add a loading state to the button and disable the validate button', async function (assert) {
      // given
      this.set('isValidateButtonEnabled', true);
      this.set('isSkipButtonEnabled', true);
      this.set('skipChallengeStub', () => sinon.promise());

      // when
      const screen = await render(hbs`<ChallengeActions
  @skipChallenge={{this.skipChallengeStub}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
/>`);

      const skipButton = screen.getByRole('button', { name: /Je passe/ });
      await click(skipButton);

      // then
      assert.dom(skipButton).hasAttribute('disabled');
      assert.dom(screen.getByRole('button', { name: /Je valide/ })).hasAttribute('disabled');
    });

    module('on request resolution or rejection', function () {
      test('it should remove the disable states', async function (assert) {
        // given
        this.set('isValidateButtonEnabled', true);
        this.set('isSkipButtonEnabled', true);
        this.set('skipChallengeStub', () => sinon.promise().reject());

        // when
        const screen = await render(hbs`<ChallengeActions
  @skipChallenge={{this.skipChallengeStub}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
/>`);

        const skipButton = screen.getByRole('button', { name: /Je passe/ });
        await click(skipButton);

        // then
        assert.dom(skipButton).hasNoAttribute('disabled');
        assert.dom(screen.getByRole('button', { name: /Je valide/ })).hasNoAttribute('disabled');
      });
    });
  });

  module('Challenge has timed out', function () {
    test('should only display "continue" button', async function (assert) {
      // given
      this.set('isValidateButtonEnabled', true);
      this.set('hasChallengeTimedOut', true);
      this.set('isSkipButtonEnabled', true);
      this.set('validateActionStub', () => {});

      // when
      await render(hbs`<ChallengeActions
  @validateAnswer={{this.validateActionStub}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
/>`);

      // then
      assert.dom('.challenge-actions__action-validated').doesNotExist();
      assert.dom('.challenge-actions__action-skip').doesNotExist();
      assert.dom('.challenge-actions__action-continue').exists();
    });
  });

  module('when user has focused out', function () {
    module('when assessent is of type certification', function () {
      module('when certification course version is 2', function () {
        test("should show certification focus out's error message", async function (assert) {
          // given
          this.set('isValidateButtonEnabled', true);
          this.set('isCertification', true);
          this.set('hasFocusedOutOfWindow', true);
          this.set('hasChallengeTimedOut', false);
          this.set('isSkipButtonEnabled', true);
          this.set('validateActionStub', () => {});
          this.set('certificationVersion', 2);

          // when
          await render(hbs`<ChallengeActions
  @isCertification={{this.isCertification}}
  @validateAnswer={{this.validateActionStub}}
  @hasFocusedOutOfWindow={{this.hasFocusedOutOfWindow}}
  @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
  @certificationVersion={{this.certificationVersion}}
/>`);

          // then
          assert.dom('[data-test="default-focused-out-error-message"]').doesNotExist();
          assert.dom('[data-test="certification-v3-focused-out-error-message"]').doesNotExist();
          assert.dom('[data-test="certification-focused-out-error-message"]').exists();
        });
      });

      module('when certification course version is 3', function () {
        module('when the candidate does not need an accessibility adjustment', function () {
          test("should show a specific certification focus out's error message", async function (assert) {
            // given
            this.set('isValidateButtonEnabled', true);
            this.set('isCertification', true);
            this.set('hasFocusedOutOfWindow', true);
            this.set('hasChallengeTimedOut', false);
            this.set('isSkipButtonEnabled', true);
            this.set('validateActionStub', () => {});
            this.set('certificationVersion', 3);

            // when
            const screen = await render(hbs`<ChallengeActions
  @isCertification={{this.isCertification}}
  @validateAnswer={{this.validateActionStub}}
  @hasFocusedOutOfWindow={{this.hasFocusedOutOfWindow}}
  @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
  @certificationVersion={{this.certificationVersion}}
/>`);

            // then
            assert
              .dom(
                screen.queryByText(
                  'Nous avons détecté un changement de page. En certification, votre réponse ne serait pas validée.',
                ),
              )
              .doesNotExist();
            assert
              .dom(
                screen.queryByText(
                  'Nous avons détecté un changement de page. Votre réponse sera comptée comme fausse. Si vous avez été contraint de changer de page, prévenez votre surveillant et répondez à la question en sa présence.',
                ),
              )
              .doesNotExist();
            assert
              .dom(
                screen.getByText(
                  "Nous avons détecté un changement de page. Votre réponse sera comptée comme fausse. Si vous avez été contraint de changer de page, prévenez votre surveillant afin qu'il puisse le constater et le signaler, le cas échéant.",
                ),
              )
              .exists();
            assert
              .dom(
                screen.queryByText(
                  "Nous avons détecté un changement de page. Si vous avez été contraint de changer de page pour utiliser un outil d’accessibilité numérique (tel qu'un lecteur d'écran ou un clavier virtuel), répondez tout de même à la question.",
                ),
              )
              .doesNotExist();
          });
        });

        module('when the candidate needs an accessibility adjustment', function () {
          test("should show another specific certification focus out's error message", async function (assert) {
            // given
            this.set('isValidateButtonEnabled', true);
            this.set('isCertification', true);
            this.set('hasFocusedOutOfWindow', true);
            this.set('hasChallengeTimedOut', false);
            this.set('isSkipButtonEnabled', true);
            this.set('validateActionStub', () => {});
            this.set('certificationVersion', 3);
            this.set('isAdjustedCourseForAccessibility', true);

            // when
            const screen = await render(hbs`<ChallengeActions
  @isCertification={{this.isCertification}}
  @validateAnswer={{this.validateActionStub}}
  @hasFocusedOutOfWindow={{this.hasFocusedOutOfWindow}}
  @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
  @certificationVersion={{this.certificationVersion}}
  @isAdjustedCourseForAccessibility={{this.isAdjustedCourseForAccessibility}}
/>`);

            // then
            assert
              .dom(
                screen.queryByText(
                  'Nous avons détecté un changement de page. En certification, votre réponse ne serait pas validée.',
                ),
              )
              .doesNotExist();
            assert
              .dom(
                screen.queryByText(
                  'Nous avons détecté un changement de page. Votre réponse sera comptée comme fausse. Si vous avez été contraint de changer de page, prévenez votre surveillant et répondez à la question en sa présence.',
                ),
              )
              .doesNotExist();
            assert
              .dom(
                screen.queryByText(
                  "Nous avons détecté un changement de page. Votre réponse sera comptée comme fausse. Si vous avez été contraint de changer de page, prévenez votre surveillant afin qu'il puisse le constater et le signaler, le cas échéant.",
                ),
              )
              .doesNotExist();
            assert
              .dom(
                screen.getByText(
                  "Nous avons détecté un changement de page. Si vous avez été contraint de changer de page pour utiliser un outil d’accessibilité numérique (tel qu'un lecteur d'écran ou un clavier virtuel), répondez tout de même à la question.",
                ),
              )
              .exists();
          });
        });
      });
    });

    module('when assessent is not of type certification', function () {
      test("should show default focus out's error message", async function (assert) {
        // given
        this.set('isValidateButtonEnabled', true);
        this.set('isCertification', false);
        this.set('hasFocusedOutOfWindow', true);
        this.set('hasChallengeTimedOut', false);
        this.set('isSkipButtonEnabled', true);
        this.set('validateActionStub', () => {});

        // when
        await render(hbs`<ChallengeActions
  @isCertification={{this.isCertification}}
  @validateAnswer={{this.validateActionStub}}
  @hasFocusedOutOfWindow={{this.hasFocusedOutOfWindow}}
  @hasChallengeTimedOut={{this.hasChallengeTimedOut}}
  @isValidateButtonEnabled={{this.isValidateButtonEnabled}}
  @isSkipButtonEnabled={{this.isSkipButtonEnabled}}
/>`);

        // then
        assert.dom('[data-test="certification-focused-out-error-message"]').doesNotExist();
        assert.dom('[data-test="default-focused-out-error-message"]').exists();
      });
    });
  });

  module('when a companion live alert exists', function () {
    test('should disable action buttons', async function (assert) {
      // given
      this.set('hasOngoingCompanionLiveAlert', true);

      // when
      const screen = await render(
        hbs`<ChallengeActions @hasOngoingCompanionLiveAlert={{this.hasOngoingCompanionLiveAlert}} />`,
      );

      // then
      assert.dom(screen.getByRole('button', { name: 'Je valide et je vais à la prochaine question' })).isDisabled();
      assert.dom(screen.getByRole('button', { name: 'Je passe et je vais à la prochaine question' })).isDisabled();
      assert.dom(screen.getByText('Les actions sont mises en pause en attendant le surveillant')).exists();
    });
  });

  module('when a challenge live alert exists', function () {
    test('should disable action buttons', async function (assert) {
      // given
      this.set('hasOngoingChallengeLiveAlert', true);

      // when
      const screen = await render(
        hbs`<ChallengeActions @hasOngoingChallengeLiveAlert={{this.hasOngoingChallengeLiveAlert}} />`,
      );

      // then
      assert.dom(screen.getByRole('button', { name: 'Je valide et je vais à la prochaine question' })).isDisabled();
      assert.dom(screen.getByRole('button', { name: 'Je passe et je vais à la prochaine question' })).isDisabled();
      assert.dom(screen.getByText('Les actions sont mises en pause en attendant le surveillant')).exists();
    });
  });
});
