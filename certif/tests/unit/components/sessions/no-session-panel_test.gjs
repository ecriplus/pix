import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import createGlimmerComponent from '../../../helpers/create-glimmer-component';

module('Unit | Component | no-session-panel', function (hooks) {
  setupTest(hooks);

  let component;

  hooks.beforeEach(function () {
    component = createGlimmerComponent('component:sessions/no-session-panel');
  });

  module('#shouldRenderImportTemplateButton', function () {
    module('when top level domain is org', function () {
      module('when current language is french', function () {
        test('should render import template button', async function (assert) {
          // given
          const store = this.owner.lookup('service:store');
          const currentAllowedCertificationCenterAccess = store.createRecord('allowed-certification-center-access', {
            type: 'SUP',
            isRelatedToManagingStudentsOrganization: false,
          });

          class CurrentUserStub extends Service {
            currentAllowedCertificationCenterAccess = currentAllowedCertificationCenterAccess;
          }
          class CurrentDomainStub extends Service {
            getExtension = sinon.stub().returns('org');
          }
          class LocaleStub extends Service {
            currentLocale = 'fr';
          }

          this.owner.register('service:current-domain', CurrentDomainStub);
          this.owner.register('service:current-user', CurrentUserStub);
          this.owner.register('service:locale', LocaleStub);

          // when
          const isRenderImportTemplateButton = component.shouldRenderImportTemplateButton;

          // then
          assert.true(isRenderImportTemplateButton);
        });
      });
      module('when current language is english', function () {
        test('should not render import template button', async function (assert) {
          // given
          const store = this.owner.lookup('service:store');
          const currentAllowedCertificationCenterAccess = store.createRecord('allowed-certification-center-access', {
            type: 'SUP',
            isRelatedToManagingStudentsOrganization: false,
          });

          class CurrentUserStub extends Service {
            currentAllowedCertificationCenterAccess = currentAllowedCertificationCenterAccess;
          }
          class CurrentDomainStub extends Service {
            getExtension = sinon.stub().returns('org');
          }
          class LocaleStub extends Service {
            currentLocale = 'en';
          }

          this.owner.register('service:current-domain', CurrentDomainStub);
          this.owner.register('service:current-user', CurrentUserStub);
          this.owner.register('service:locale', LocaleStub);

          // when
          const isRenderImportTemplateButton = component.shouldRenderImportTemplateButton;

          // then
          assert.false(isRenderImportTemplateButton);
        });
      });
    });

    module('when top level domain is fr', function () {
      test('should render import template button', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const currentAllowedCertificationCenterAccess = store.createRecord('allowed-certification-center-access', {
          type: 'SUP',
          isRelatedToManagingStudentsOrganization: false,
        });

        class CurrentUserStub extends Service {
          currentAllowedCertificationCenterAccess = currentAllowedCertificationCenterAccess;
        }
        class CurrentDomainStub extends Service {
          getExtension = sinon.stub().returns('fr');
        }
        class LocaleStub extends Service {
          currentLocale = 'fr';
        }

        this.owner.register('service:current-domain', CurrentDomainStub);
        this.owner.register('service:current-user', CurrentUserStub);
        this.owner.register('service:locale', LocaleStub);

        // when
        const isRenderImportTemplateButton = component.shouldRenderImportTemplateButton;

        // then
        assert.true(isRenderImportTemplateButton);
      });
    });
  });
});
