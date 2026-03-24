import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ScoOrganizationParticipantTableRow from 'pix-orga/components/sco-organization-participant/table-row';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | ScoOrganizationParticipant::TableRow', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when hideCertifiableDate is true', function () {
    test('it should not display certifiableAt date', async function (assert) {
      // given
      const certifiableDate = '10/10/2023';
      const noop = sinon.stub();
      const student = {
        firstName: 'Jean',
        lastName: 'Bon',
        birthdate: '2020/01/01',
        division: '3A',
        authenticationMethods: [],
        participationCount: 1,
        isCertifiable: true,
        certifiableAt: new Date(certifiableDate),
      };
      const hasComputeOrganizationLearnerCertificabilityEnabled = true;

      // when
      const screen = await render(
        <template>
          <ScoOrganizationParticipantTableRow
            @showCheckbox={{noop}}
            @student={{student}}
            @isStudentSelected={{noop}}
            @openAuthenticationMethodModal={{noop}}
            @onToggleStudent={{noop}}
            @onClickLearner={{noop}}
            @hideCertifiableDate={{hasComputeOrganizationLearnerCertificabilityEnabled}}
          />
        </template>,
      );

      // then
      assert.dom(screen.queryByText(certifiableDate)).doesNotExist();
    });
  });

  module('when hasComputeOrganizationLearnerCertificabilityEnabled is false', function () {
    test('it display certifiableAt date', async function (assert) {
      // given
      const certifiableDate = '10/10/2023';
      const noop = sinon.stub();
      const student = {
        firstName: 'Jean',
        lastName: 'Bon',
        birthdate: '2020/01/01',
        division: '3A',
        authenticationMethods: [],
        participationCount: 1,
        isCertifiable: true,
        certifiableAt: new Date(certifiableDate),
      };
      const hasComputeOrganizationLearnerCertificabilityEnabled = false;

      // when
      const screen = await render(
        <template>
          <ScoOrganizationParticipantTableRow
            @showCheckbox={{noop}}
            @student={{student}}
            @isStudentSelected={{noop}}
            @openAuthenticationMethodModal={{noop}}
            @onToggleStudent={{noop}}
            @onClickLearner={{noop}}
            @hideCertifiableDate={{hasComputeOrganizationLearnerCertificabilityEnabled}}
          />
        </template>,
      );

      // then
      assert.dom(screen.getByText(certifiableDate)).exists();
    });
  });

  module('when student is temporarily blocked', function () {
    test('it displays a temporarily blocked label', async function (assert) {
      // given
      const noop = sinon.stub();
      const student = {
        isTemporarilyBlocked: true,
      };

      // when
      const screen = await render(
        <template>
          <ScoOrganizationParticipantTableRow
            @showCheckbox={{noop}}
            @student={{student}}
            @isStudentSelected={{noop}}
            @openAuthenticationMethodModal={{noop}}
            @onToggleStudent={{noop}}
            @onClickLearner={{noop}}
          />
        </template>,
      );

      // then
      assert
        .dom(screen.getByText(t('pages.sco-organization-participants.user-account-blocking-types.temporarily-blocked')))
        .exists();
    });
  });

  module('when student is blocked', function () {
    test('it displays a blocked label', async function (assert) {
      // given
      const noop = sinon.stub();
      const student = {
        isBlocked: true,
      };

      // when
      const screen = await render(
        <template>
          <ScoOrganizationParticipantTableRow
            @showCheckbox={{noop}}
            @student={{student}}
            @isStudentSelected={{noop}}
            @openAuthenticationMethodModal={{noop}}
            @onToggleStudent={{noop}}
            @onClickLearner={{noop}}
          />
        </template>,
      );

      // then
      assert
        .dom(screen.getByText(t('pages.sco-organization-participants.user-account-blocking-types.blocked')))
        .exists();
    });
  });
});
