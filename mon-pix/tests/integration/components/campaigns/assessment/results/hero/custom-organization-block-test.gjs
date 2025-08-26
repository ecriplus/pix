import { render } from '@1024pix/ember-testing-library';
import CustomOrganizationBlock from 'mon-pix/components/campaigns/assessment/results/evaluation-results-hero/custom-organization-block';
import Location from 'mon-pix/utils/location';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../../../helpers/setup-intl-rendering';

module(
  'Integration | Components | Campaigns | Assessment | Results | Evaluation Results Hero | Custom Organization Block',
  function (hooks) {
    setupIntlRenderingTest(hooks);

    module('custom text', function () {
      module('when organization custom text is defined', function () {
        test('displays organization custom text', async function (assert) {
          // given
          const customResultPageText = 'My custom result page text';

          const campaign = {
            customResultPageText,
          };

          // when
          const screen = await render(<template><CustomOrganizationBlock @campaign={{campaign}} /></template>);

          // then
          assert.dom(screen.getByText(customResultPageText)).exists();
        });
      });

      module('when organization custom text is not defined', function () {
        test('not display organization custom text', async function (assert) {
          // given
          const campaign = {
            customResultPageText: null,
          };

          // when
          const screen = await render(<template><CustomOrganizationBlock @campaign={{campaign}} /></template>);

          // then
          assert.dom(screen.queryByRole('paragraph')).doesNotExist();
        });
      });
    });

    module('custom button', function () {
      module('when organization custom link url and label are defined', function () {
        module('when organization custom link url is absolute', function () {
          test('displays organization custom link', async function (assert) {
            // given
            const customResultPageButtonUrl = 'https://pix.org/';
            const customResultPageButtonText = 'My custom button';

            const campaign = {
              customResultPageButtonUrl,
              customResultPageButtonText,
            };

            const campaignParticipationResult = {
              masteryRate: 0.75,
            };

            // when
            const screen = await render(
              <template>
                <CustomOrganizationBlock
                  @campaign={{campaign}}
                  @campaignParticipationResult={{campaignParticipationResult}}
                />
              </template>,
            );

            // then
            assert.strictEqual(
              screen.getByRole('link', { name: customResultPageButtonText }).href,
              `${customResultPageButtonUrl}?masteryPercentage=75`,
            );
          });
        });
        module('when organization custom link url is relative', function () {
          test('displays organization custom link', async function (assert) {
            // given
            const origin = 'https://pix.fr';
            sinon.stub(Location, 'getOrigin').returns(origin);
            const customResultPageButtonUrl = '/parcours/COMBINIX1';
            const customResultPageButtonText = 'My custom button';

            const campaign = {
              customResultPageButtonUrl,
              customResultPageButtonText,
            };

            const campaignParticipationResult = {
              masteryRate: 0.75,
            };

            // when
            const screen = await render(
              <template>
                <CustomOrganizationBlock
                  @campaign={{campaign}}
                  @campaignParticipationResult={{campaignParticipationResult}}
                />
              </template>,
            );

            // then
            assert.strictEqual(
              screen.getByRole('link', { name: customResultPageButtonText }).href,
              `${origin}${customResultPageButtonUrl}?masteryPercentage=75`,
            );
          });
        });
      });

      module('when organization custom link url is defined but label is not', function () {
        test('not display organization custom link', async function (assert) {
          // given
          const customResultPageButtonUrl = 'https://pix.org/';

          const campaign = {
            customResultPageButtonUrl,
          };

          // when
          const screen = await render(<template><CustomOrganizationBlock @campaign={{campaign}} /></template>);

          // then
          assert.dom(screen.queryByRole('link')).doesNotExist();
        });
      });

      module('when organization custom link label is defined but url is not', function () {
        test('not display organization custom link', async function (assert) {
          // given

          const campaign = {
            customResultPageButtonUrl: null,
            customResultPageButtonText: 'Some custom button text',
          };

          // when
          const screen = await render(<template><CustomOrganizationBlock @campaign={{campaign}} /></template>);

          // then
          assert.dom(screen.queryByRole('link')).doesNotExist();
        });
      });
    });
  },
);
