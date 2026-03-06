import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | ScoOrganizationParticipant::TableRow', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when hideCertifiableDate is true', function () {
    test('it should not display certifiableAt date', async function (assert) {
      // given
      const certifiableDate = '10/10/2023';
      this.set('noop', sinon.stub());
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
      this.set('student', student);
      this.set('hasComputeOrganizationLearnerCertificabilityEnabled', true);

      // when
      const screen = await render(
        hbs`<ScoOrganizationParticipant::TableRow
  @showCheckbox={{this.noop}}
  @student={{this.student}}
  @isStudentSelected={{this.noop}}
  @openAuthenticationMethodModal={{this.noop}}
  @onToggleStudent={{this.noop}}
  @onClickLearner={{this.noop}}
  @hideCertifiableDate={{this.hasComputeOrganizationLearnerCertificabilityEnabled}}
/>`,
      );

      // then
      assert.dom(screen.queryByText(certifiableDate)).doesNotExist();
    });
  });

  module('when hasComputeOrganizationLearnerCertificabilityEnabled is false', function () {
    test('it display certifiableAt date', async function (assert) {
      // given
      const certifiableDate = '10/10/2023';
      this.set('noop', sinon.stub());
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
      this.set('student', student);
      this.set('hasComputeOrganizationLearnerCertificabilityEnabled', false);

      // when
      const screen = await render(
        hbs`<ScoOrganizationParticipant::TableRow
  @showCheckbox={{this.noop}}
  @student={{this.student}}
  @isStudentSelected={{this.noop}}
  @openAuthenticationMethodModal={{this.noop}}
  @onToggleStudent={{this.noop}}
  @onClickLearner={{this.noop}}
  @hideCertifiableDate={{this.hasComputeOrganizationLearnerCertificabilityEnabled}}
/>`,
      );

      // then
      assert.dom(screen.getByText(certifiableDate)).exists();
    });
  });

  module('when student is temporarily blocked', function () {
    test('it displays a temporarily blocked label', async function (assert) {
      // given
      this.set('noop', sinon.stub());
      const student = {
        isTemporarilyBlocked: true,
      };
      this.set('student', student);

      // when
      const screen = await render(
        hbs`<ScoOrganizationParticipant::TableRow
  @showCheckbox={{this.noop}}
  @student={{this.student}}
  @isStudentSelected={{this.noop}}
  @openAuthenticationMethodModal={{this.noop}}
  @onToggleStudent={{this.noop}}
  @onClickLearner={{this.noop}}
/>`,
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
      this.set('noop', sinon.stub());
      const student = {
        isBlocked: true,
      };
      this.set('student', student);

      // when
      const screen = await render(
        hbs`<ScoOrganizationParticipant::TableRow
  @showCheckbox={{this.noop}}
  @student={{this.student}}
  @isStudentSelected={{this.noop}}
  @openAuthenticationMethodModal={{this.noop}}
  @onToggleStudent={{this.noop}}
  @onClickLearner={{this.noop}}
/>`,
      );

      // then
      assert
        .dom(screen.getByText(t('pages.sco-organization-participants.user-account-blocking-types.blocked')))
        .exists();
    });
  });
});
