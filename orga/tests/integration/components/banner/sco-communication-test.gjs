import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import Scommunication from 'pix-orga/components/banner/sco-communication';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Banner::Sco-communication', function (hooks) {
  let featureToggles;
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.intl = this.owner.lookup('service:intl');
    featureToggles = this.owner.lookup('service:featureToggles');
  });

  module('Import Banner', function () {
    module('when prescriber’s organization is of type SCO that manages students', function () {
      [
        'authenticated.campaigns.list.my-campaigns',
        'authenticated.campaigns.list.all-campaigns',
        'authenticated.team.list.members',
        'authenticated.sco-organization-participants.list',
      ].forEach((route) => {
        module(`when prescriber is on route ${route}`, function () {
          class CurrentUserStub extends Service {
            organization = { isSco: true };
            isSCOManagingStudents = true;
          }

          test('should render the sco banner', async function (assert) {
            sinon.stub(featureToggles, 'featureToggles').value({ displayIaCampaignBanner: false });
            // given
            this.owner.register('service:current-user', CurrentUserStub);

            const router = this.owner.lookup('service:router');
            sinon.stub(router, 'currentRouteName').value(route);
            // when
            const screen = await render(<template><Scommunication /></template>);

            // then
            assert.ok(screen.getByText(this.intl.t('banners.import.message')));

            const downloadLink = screen.getByRole('link', { name: 'télécharger les résultats' });
            assert.strictEqual(downloadLink.href, 'https://cloud.pix.fr/s/WjTnkSbFs9TDcSC');

            const importLink = screen.queryByRole('link', { name: 'importer' });
            assert.ok(importLink.href.endsWith('/import-participants'));

            const createCampaignLink = screen.queryByRole('link', { name: 'Créer les campagnes' });
            assert.strictEqual(createCampaignLink.href, 'https://cloud.pix.fr/s/RaPpKjFHNX2kSR4');

            const certifLink = screen.queryByRole('link', { name: 'En savoir plus sur la certification' });
            assert.strictEqual(certifLink.href, 'https://cloud.pix.fr/s/opiFxfjygR76S8y');
          });

          test('should render the ia sco banner', async function (assert) {
            sinon.stub(featureToggles, 'featureToggles').value({ displayIaCampaignBanner: true });
            // given
            this.owner.register('service:current-user', CurrentUserStub);

            const router = this.owner.lookup('service:router');
            sinon.stub(router, 'currentRouteName').value(route);
            // when
            const screen = await render(<template><Scommunication /></template>);

            // then
            assert.ok(screen.getByText(this.intl.t('banners.ia.message')));

            const KitLink = screen.getByRole('link', { name: 'le kit de déploiement' });
            assert.strictEqual(KitLink.href, 'https://cloud.pix.fr/s/rrkLPMS5dYGKRQ9');

            const webinaireLink = screen.queryByRole('link', { name: 'webinaire' });
            assert.strictEqual(
              webinaireLink.href,
              'https://app.livestorm.co/pix-1/parcours-intelligence-artificielle-enseignement-scolaire?utm_source=pixorga',
            );
          });
        });
      });

      module('when prescriber is on route certification', function () {
        class CurrentUserStub extends Service {
          organization = { isSco: true };
          isSCOManagingStudents = true;
        }

        class Router extends Service {
          currentRouteName = 'authenticated.certifications';
        }

        test('should not display alert', async function (assert) {
          // given
          this.owner.register('service:current-user', CurrentUserStub);
          this.owner.register('service:router', Router);

          // when
          const screen = await render(<template><Scommunication /></template>);
          const alert = screen.queryByRole('alert');

          // then
          assert.notOk(alert);
        });
      });
    });

    module('when prescriber’s organization is not of type SCO that manages students', function () {
      [
        'authenticated.campaigns.list.my-campaigns',
        'authenticated.campaigns.list.all-campaigns',
        'authenticated.team.list.members',
        'authenticated.sco-organization-participants.list',
      ].forEach((route) => {
        test(`should not render the banner even if current route is ${route}`, async function (assert) {
          // given
          class CurrentUserStub extends Service {
            organization = { isSco: false };
            isSCOManagingStudents = false;
          }
          class Router extends Service {
            currentRouteName = route;
          }

          this.owner.register('service:current-user', CurrentUserStub);
          this.owner.register('service:router', Router);

          // when
          const screen = await render(<template><Scommunication /></template>);

          // then
          const alert = screen.queryByRole('alert');
          // then
          assert.notOk(alert);
        });
      });
    });
  });
});
