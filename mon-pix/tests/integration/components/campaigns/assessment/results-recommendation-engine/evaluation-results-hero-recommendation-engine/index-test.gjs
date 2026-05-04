import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import EvaluationResultsHeroRecommendationEngine from 'mon-pix/components/campaigns/assessment/results-recommendation-engine/evaluation-results-hero-recommendation-engine/index';
import { module, test } from 'qunit';

import { stubCurrentUserService } from '../../../../../../helpers/service-stubs';
import setupIntlRenderingTest from '../../../../../../helpers/setup-intl-rendering';

module(
  'Integration | Components | Campaigns | Assessment | ResultsRecommendationEngine | EvaluationResultsHeroRecommendationEngine',
  function (hooks) {
    setupIntlRenderingTest(hooks);

    module('global behaviour', function (hooks) {
      hooks.beforeEach(async function () {
        stubCurrentUserService(this.owner, { id: 1, firstName: 'Hermione' });
      });

      module('when screen is mobile', function () {
        test('it display a separator', async function (assert) {
          // given
          const campaign = { organizationId: 1 };
          const campaignParticipationResult = { masteryRate: 0.755 };

          this.owner.register(
            'service:media',
            class MediaService extends Service {
              isMobile = true;
            },
          );

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
              />
            </template>,
          );

          // then
          assert.dom(screen.getByRole('separator')).exists();
        });
      });

      module('when screen is not mobile', function () {
        test('it does not display a separator', async function (assert) {
          // given
          const campaign = { organizationId: 1 };
          const campaignParticipationResult = { masteryRate: 0.755 };

          this.owner.register(
            'service:media',
            class MediaService extends Service {
              isMobile = false;
            },
          );

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
              />
            </template>,
          );

          // then
          assert.dom(screen.queryByRole('separator')).doesNotExist();
        });
      });

      test('it displays a congratulation title', async function (assert) {
        // given
        const campaign = { organizationId: 1 };
        const campaignParticipationResult = { masteryRate: 0.755 };

        // when
        const screen = await render(
          <template>
            <EvaluationResultsHeroRecommendationEngine
              @campaign={{campaign}}
              @campaignParticipationResult={{campaignParticipationResult}}
            />
          </template>,
        );

        // then
        assert
          .dom(
            screen.getByRole('heading', {
              name: t('pages.skill-review.hero.thanks', { name: 'Hermione' }).replace('\n', ''),
            }),
          )
          .exists();
      });

      test('it displays a rounded mastery rate', async function (assert) {
        // given
        const campaign = { organizationId: 1 };
        const campaignParticipationResult = { masteryRate: 0.755 };

        // when
        const screen = await render(
          <template>
            <EvaluationResultsHeroRecommendationEngine
              @campaign={{campaign}}
              @campaignParticipationResult={{campaignParticipationResult}}
            />
          </template>,
        );

        // then
        const masteryRateElementWithoutWhiteSpaceTrimmed = screen.getByText('76').textContent.replace(/\s/g, '').trim();
        assert.strictEqual(masteryRateElementWithoutWhiteSpaceTrimmed, '76%');
        assert.dom(screen.getByText(t('pages.skill-review.hero.mastery-rate'))).exists();
      });
    });

    module('stages', function () {
      module('when there are multiple stages', function () {
        test('it displays reached stage stars', async function (assert) {
          // given
          const campaign = { organizationId: 1 };
          const campaignParticipationResult = {
            hasReachedStage: true,
            reachedStage: { reachedStage: 4, totalStage: 5 },
          };

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
              />
            </template>,
          );

          // then
          const stars = { acquired: 3, total: 4 };
          assert.dom(screen.getByText(t('pages.skill-review.stage.starsAcquired', stars))).exists();
          assert.dom(screen.getByText(t('pages.skill-review.stage.recommendedEngine.starsAcquired', stars))).exists();
        });
      });

      module('when there is only one stage', function () {
        test('it does not display stars', async function (assert) {
          // given
          const campaign = { organizationId: 1 };
          const campaignParticipationResult = {
            hasReachedStage: true,
            reachedStage: { reachedStage: 1, totalStage: 1 },
          };

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
              />
            </template>,
          );

          // then
          const stars = { acquired: 0, total: 0 };
          assert.dom(screen.queryByText(t('pages.skill-review.stage.starsAcquired', stars))).doesNotExist();
        });
      });

      module('when there is no stage', function () {
        test('it does not display stars', async function (assert) {
          // given
          const campaign = { organizationId: 1 };
          const campaignParticipationResult = { hasReachedStage: false };

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
              />
            </template>,
          );

          // then
          assert
            .dom(screen.queryByText(t('pages.skill-review.stage.starsAcquired', { acquired: 0, total: 0 })))
            .doesNotExist();
        });
      });
    });

    module('acquired badges', function () {
      module('when there is at least one acquired badge', function () {
        test('it displays the compact badges list', async function (assert) {
          // given
          const store = this.owner.lookup('service:store');
          const acquiredBadge = store.createRecord('campaign-participation-badge', {
            isAcquired: true,
            altMessage: 'Badge alt text',
            imageUrl: '/images/background/hexa-pix.svg',
          });
          const campaignParticipationResult = store.createRecord('campaign-participation-result', {
            campaignParticipationBadges: [acquiredBadge],
          });
          const campaign = { organizationId: 1 };

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
              />
            </template>,
          );

          // then
          assert.dom(screen.getByRole('img', { name: 'Badge alt text' })).exists();
        });
      });

      module('when there is no acquired badge', function () {
        test('it does not display the badges list', async function (assert) {
          // given
          const store = this.owner.lookup('service:store');
          const notAcquiredBadge = store.createRecord('campaign-participation-badge', { isAcquired: false });
          const campaignParticipationResult = store.createRecord('campaign-participation-result', {
            campaignParticipationBadges: [notAcquiredBadge],
          });
          const campaign = { organizationId: 1 };

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
              />
            </template>,
          );

          // then
          assert.dom(screen.queryByRole('list')).doesNotExist();
        });
      });
    });

    module('when campaign is a regular campaign', function () {
      module('when there are trainings', function () {
        test('it displays a see-trainings button', async function (assert) {
          // given
          stubCurrentUserService(this.owner, { firstName: 'Hermione' });
          const campaign = { organizationId: 1 };
          const campaignParticipationResult = { masteryRate: 0.75 };

          // when
          const screen = await render(
            <template>
              <EvaluationResultsHeroRecommendationEngine
                @campaign={{campaign}}
                @campaignParticipationResult={{campaignParticipationResult}}
                @hasTrainings={{true}}
              />
            </template>,
          );

          // then
          assert.dom(screen.getByRole('button', { name: t('pages.skill-review.hero.see-trainings') })).exists();
          assert.dom(screen.queryByRole('link', { name: t('navigation.back-to-homepage') })).doesNotExist();
        });
      });

      module('when there are no trainings', function () {
        module('when there is no custom result page button', function () {
          test('it displays a back-to-homepage link', async function (assert) {
            // given
            stubCurrentUserService(this.owner, { firstName: 'Hermione' });
            const campaign = { organizationId: 1, hasCustomResultPageButton: false };
            const campaignParticipationResult = { masteryRate: 0.75 };

            // when
            const screen = await render(
              <template>
                <EvaluationResultsHeroRecommendationEngine
                  @campaign={{campaign}}
                  @campaignParticipationResult={{campaignParticipationResult}}
                  @hasTrainings={{false}}
                />
              </template>,
            );

            // then
            assert.dom(screen.getByRole('link', { name: t('navigation.back-to-homepage') })).exists();
            assert
              .dom(screen.queryByRole('button', { name: t('pages.skill-review.hero.see-trainings') }))
              .doesNotExist();
          });
        });
      });
    });
  },
);
