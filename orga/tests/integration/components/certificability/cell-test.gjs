import { render } from '@1024pix/ember-testing-library';
import Cell from 'pix-orga/components/certificability/cell';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Certificability::Cell', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should not display certifiableAt', async function (assert) {
    const hasComputeOrganizationLearnerCertificabilityEnabled = true;
    // when
    const screen = await render(
      <template>
        <Cell
          @hideCertifiableDate={{hasComputeOrganizationLearnerCertificabilityEnabled}}
          @isCertifiable={{true}}
          @certifiableAt="2023-12-25"
        />
      </template>,
    );

    // then
    assert.notOk(screen.queryByText('25/12/2023'));
  });

  test('it should display certifiableAt', async function (assert) {
    const hasComputeOrganizationLearnerCertificabilityEnabled = false;
    // when
    const screen = await render(
      <template>
        <Cell
          @hideCertifiableDate={{hasComputeOrganizationLearnerCertificabilityEnabled}}
          @isCertifiable={{true}}
          @certifiableAt="2023-12-25"
        />
      </template>,
    );

    // then
    assert.ok(screen.queryByText('25/12/2023'));
  });
});
