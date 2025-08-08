import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import Survey from 'pix-orga/components/banner/survey';
import ENV from 'pix-orga/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Banner::Survey', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('Survey Banner', function () {
    module('should render the survey', function () {
      test('when prescriber is on myCampaign page', async function (assert) {
        // given
        ENV.APP.SURVEY_BANNER_ENABLED = true;
        ENV.APP.SURVEY_LINK = 'https://www.google.com';

        class RouterStub extends Service {
          currentRouteName = 'authenticated.campaigns.list.my-campaigns';
        }
        this.owner.register('service:router', RouterStub);

        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('fr');

        // when
        const screen = await render(<template><Survey /></template>);

        const link = screen.getByRole('link', { name: 'Accédez à l’enquête' });

        // then
        assert.strictEqual(link.href, 'https://www.google.com/');
      });

      test('when prescriber is on allCampaign page', async function (assert) {
        // given
        ENV.APP.SURVEY_BANNER_ENABLED = true;
        ENV.APP.SURVEY_LINK = 'https://www.google.com';

        class RouterStub extends Service {
          currentRouteName = 'authenticated.campaigns.list.my-campaigns';
        }
        this.owner.register('service:router', RouterStub);

        const domainService = this.owner.lookup('service:currentDomain');
        sinon.stub(domainService, 'getExtension').returns('fr');

        // when
        const screen = await render(<template><Survey /></template>);

        const link = screen.getByRole('link', { name: 'Accédez à l’enquête' });

        // then
        assert.strictEqual(link.href, 'https://www.google.com/');
      });
    });

    module('should not render the survey', function () {
      test('when prescriber is not on allCampaign or myCampaign page', async function (assert) {
        // given
        ENV.APP.SURVEY_BANNER_ENABLED = true;
        ENV.APP.SURVEY_LINK = 'https://www.google.com';

        class RouterStub extends Service {
          currentRouteName = 'authenticated.sco-organization-participants.list';
        }
        this.owner.register('service:router', RouterStub);

        // when
        const screen = await render(<template><Survey /></template>);

        // then
        assert.notOk(screen.queryByRole('link', { name: 'Accédez à l’enquête' }));
      });

      test('when the environnement variable is not set', async function (assert) {
        // given
        ENV.APP.SURVEY_BANNER_ENABLED = false;
        ENV.APP.SURVEY_LINK = 'https://www.google.com';

        class RouterStub extends Service {
          currentRouteName = 'authenticated.campaigns.list.my-campaigns';
        }
        this.owner.register('service:router', RouterStub);

        // when
        const screen = await render(<template><Survey /></template>);

        // then
        assert.notOk(screen.queryByRole('link', { name: 'Accédez à l’enquête' }));
      });

      test('when prescriber in not on fr domain', async function (assert) {
        // given
        ENV.APP.SURVEY_BANNER_ENABLED = true;
        ENV.APP.SURVEY_LINK = 'https://www.google.com';

        class RouterStub extends Service {
          currentRouteName = 'authenticated.campaigns.list.my-campaigns';
        }
        this.owner.register('service:router', RouterStub);

        // when
        const screen = await render(<template><Survey /></template>);

        // then
        assert.notOk(screen.queryByRole('link', { name: 'Accédez à l’enquête' }));
      });
    });
  });
});
