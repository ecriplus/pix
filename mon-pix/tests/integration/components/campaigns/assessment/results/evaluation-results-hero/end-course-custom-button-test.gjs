import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import EndCourseCustomButton from 'mon-pix/components/campaigns/assessment/results/evaluation-results-hero/end-course-custom-button';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../../../helpers/setup-intl-rendering';

module(
  'Integration | Components | Campaigns | Assessment | Results | Evaluation Results Hero | End Course custom button',
  function (hooks) {
    setupIntlRenderingTest(hooks);

    module('when organization custom link url and label are defined', function (hooks) {
      let router;
      hooks.beforeEach(function () {
        router = this.owner.lookup('service:router');
      });

      module('when organization custom link url is absolute', function () {
        test('displays organization custom link with masteryRate queryParams', async function (assert) {
          // given
          const customResultPageButtonUrl = 'https://pix.org/';
          const customResultPageButtonText = 'My custom button';

          const masteryRate = 0.75;

          // when
          const screen = await render(
            <template>
              <EndCourseCustomButton
                @buttonLink={{customResultPageButtonUrl}}
                @buttonText={{customResultPageButtonText}}
                @masteryRate={{masteryRate}}
              />
            </template>,
          );

          // then
          assert.strictEqual(
            screen.getByRole('link', { name: customResultPageButtonText }).href,
            `${customResultPageButtonUrl}?masteryPercentage=75`,
          );
        });

        test('displays organization custom link with externalId queryParams', async function (assert) {
          // given
          const customResultPageButtonUrl = 'https://pix.org/';
          const customResultPageButtonText = 'My custom button';

          const participantExternalId = 'mauriceLeChocoSuisse';

          // when
          const screen = await render(
            <template>
              <EndCourseCustomButton
                @buttonLink={{customResultPageButtonUrl}}
                @buttonText={{customResultPageButtonText}}
                @participantExternalId={{participantExternalId}}
              />
            </template>,
          );

          // then
          assert.strictEqual(
            screen.getByRole('link', { name: customResultPageButtonText }).href,
            `${customResultPageButtonUrl}?externalId=${participantExternalId}`,
          );
        });

        test('displays organization custom link with stage queryParams', async function (assert) {
          // given
          const store = this.owner.lookup('service:store');
          const reachedStage = store.createRecord('reachedStage', {
            threshold: 18,
          });
          const customResultPageButtonUrl = 'https://pix.org/';
          const customResultPageButtonText = 'My custom button';

          // when
          const screen = await render(
            <template>
              <EndCourseCustomButton
                @buttonLink={{customResultPageButtonUrl}}
                @buttonText={{customResultPageButtonText}}
                @reachedStage={{reachedStage}}
              />
            </template>,
          );

          // then
          assert.strictEqual(
            screen.getByRole('link', { name: customResultPageButtonText }).href,
            `${customResultPageButtonUrl}?stage=${reachedStage.threshold}`,
          );
        });

        test('displays organization custom link with combined queryParams', async function (assert) {
          // given
          const store = this.owner.lookup('service:store');
          const reachedStage = store.createRecord('reachedStage', {
            threshold: 18,
          });
          const participantExternalId = 'mauriceLeChocoSuisse';
          const customResultPageButtonUrl = 'https://pix.org/';
          const customResultPageButtonText = 'My custom button';

          // when
          const screen = await render(
            <template>
              <EndCourseCustomButton
                @buttonLink={{customResultPageButtonUrl}}
                @buttonText={{customResultPageButtonText}}
                @reachedStage={{reachedStage}}
                @participantExternalId={{participantExternalId}}
              />
            </template>,
          );

          // then
          assert.strictEqual(
            screen.getByRole('link', { name: customResultPageButtonText }).href,
            `${customResultPageButtonUrl}?externalId=${participantExternalId}&stage=${reachedStage.threshold}`,
          );
        });
      });

      module('when organization custom link url is relative', function () {
        test('displays organization custom link', async function (assert) {
          // given
          const transitionToStub = sinon.stub(router, 'transitionTo');
          const customResultPageButtonUrl = '/parcours/COMBINIX1';
          const customResultPageButtonText = 'My custom button';

          const masteryRate = 0.75;

          // when
          const screen = await render(
            <template>
              <EndCourseCustomButton
                @buttonLink={{customResultPageButtonUrl}}
                @buttonText={{customResultPageButtonText}}
                @masteryRate={{masteryRate}}
              />
            </template>,
          );

          await click(screen.getByRole('button', { name: customResultPageButtonText }));

          // then
          assert.ok(screen.getByRole('button', { name: customResultPageButtonText }));
          assert.ok(transitionToStub.calledWithExactly(customResultPageButtonUrl));
        });
      });
    });
  },
);
