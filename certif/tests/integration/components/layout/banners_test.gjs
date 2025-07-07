import { clickByName, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import Banners from 'pix-certif/components/layout/banners';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupRenderingIntlTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Layout | Banners', function (hooks) {
  setupRenderingIntlTest(hooks);

  let session;
  let store;
  let currentAllowedCertificationCenterAccess;
  let certificationPointOfContact;

  hooks.beforeEach(function () {
    session = this.owner.lookup('service:session');
    store = this.owner.lookup('service:store');
    currentAllowedCertificationCenterAccess = store.createRecord('allowed-certification-center-access', {
      id: '123',
      name: 'allowedCenter',
      type: 'NOT_SCO',
    });
    certificationPointOfContact = {
      firstName: 'Alain',
      lastName: 'Cendy',
    };

    class CurrentUserStub extends Service {
      currentAllowedCertificationCenterAccess = currentAllowedCertificationCenterAccess;
      certificationPointOfContact = certificationPointOfContact;
      updateCurrentCertificationCenter = sinon.stub();
    }

    this.owner.register('service:current-user', CurrentUserStub);
  });

  module('Language availability', function () {
    module('when user language is available', function () {
      test('does not display the language availability banner', async function (assert) {
        // given
        session.data.localeNotSupported = false;
        session.data.localeNotSupportedBannerClosed = false;

        // when
        const screen = await render(<template><Banners /></template>);

        // then
        assert.dom(screen.queryByRole('alert')).doesNotExist();
      });
    });

    module('when user language is not available', function (hooks) {
      hooks.beforeEach(function () {
        session.data.localeNotSupported = true;
      });

      module('when the user has not closed the banner', function () {
        test('displays the language availability banner', async function (assert) {
          // given
          session.data.localeNotSupportedBannerClosed = false;

          // when
          const screen = await render(<template><Banners /></template>);

          // then
          assert
            .dom(
              screen.getByText(
                `Votre langue n'est pas encore disponible sur Pix Certif. Pour votre confort, l'application sera présentée en anglais. Toute l'équipe de Pix travaille à l'ajout de votre langue.`,
              ),
            )
            .exists();
        });

        module('when user close the language availability banner', function () {
          test('closes the language availability banner', async function (assert) {
            // given
            session.data.localeNotSupportedBannerClosed = false;
            const screen = await render(<template><Banners /></template>);

            // when
            await clickByName('Fermer');

            // then
            assert.dom(screen.queryByRole('alert')).doesNotExist();
          });
        });
      });

      module('when the user has closed the banner', function () {
        test('does not display the language availability banner', async function (assert) {
          // given
          session.data.localeNotSupportedBannerClosed = true;

          // when
          const screen = await render(<template><Banners /></template>);

          // then
          assert.dom(screen.queryByRole('alert')).doesNotExist();
        });
      });
    });
  });

  module('when certification center is SCO managing students and user is not on finalization page', function () {
    test('should display banner', async function (assert) {
      //given
      const serviceRouter = this.owner.lookup('service:router');
      const RouterStub = sinon.stub(serviceRouter, 'currentRouteName').value('authenticated.sessions.not-finalize');

      this.owner.register('service:router', RouterStub);

      currentAllowedCertificationCenterAccess = store.createRecord('allowed-certification-center-access', {
        id: '789',
        name: 'allowedCenter',
        type: 'SCO',
        isRelatedToManagingStudentsOrganization: true,
      });
      certificationPointOfContact = {
        firstName: 'Alain',
        lastName: 'Proviste',
      };

      class CurrentUserStub extends Service {
        currentAllowedCertificationCenterAccess = currentAllowedCertificationCenterAccess;
        certificationPointOfContact = certificationPointOfContact;
        updateCurrentCertificationCenter = sinon.stub();
      }

      this.owner.register('service:current-user', CurrentUserStub);

      // when
      const screen = await render(<template><Banners /></template>);

      // then
      assert.dom(screen.queryByText('La Certification Pix se déroulera ')).doesNotExist();
    });
  });

  module('Display SCO information banner', function () {
    module('when certification center is not SCO IsManagingStudents', function () {
      test('should not display banner', async function (assert) {
        //given
        const serviceRouter = this.owner.lookup('service:router');
        sinon.stub(serviceRouter, 'currentRouteName').value('authenticated.sessions.not-finalize');

        // when
        const screen = await render(<template><Banners /></template>);

        // then
        assert.dom(screen.queryByRole('alert')).doesNotExist();
      });
    });

    module('when user is on finalization page', function () {
      test('should not display banner', async function (assert) {
        //given
        const serviceRouter = this.owner.lookup('service:router');
        const RouterStub = sinon.stub(serviceRouter, 'currentRouteName').value('authenticated.sessions.finalize');

        this.owner.register('service:router', RouterStub);

        currentAllowedCertificationCenterAccess = store.createRecord('allowed-certification-center-access', {
          id: '456',
          name: 'allowedCenter',
          type: 'SCO',
          isRelatedToManagingStudentsOrganization: true,
        });
        certificationPointOfContact = {
          firstName: 'Alain',
          lastName: 'Térieur',
        };

        class CurrentUserStub extends Service {
          currentAllowedCertificationCenterAccess = currentAllowedCertificationCenterAccess;
          certificationPointOfContact = certificationPointOfContact;
          updateCurrentCertificationCenter = sinon.stub();
        }

        this.owner.register('service:current-user', CurrentUserStub);

        // when
        const screen = await render(<template><Banners /></template>);

        // then
        assert
          .dom(
            screen.queryByText(
              (content) =>
                content.startsWith('La Certification Pix se déroulera du 7 novembre 2024 au 7 mars 2025 ') &&
                content.endsWith('Collèges : du 17 mars au 13 juin 2025.'),
            ),
          )
          .doesNotExist();
      });
    });
  });
});
