import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import AttestationCard from 'mon-pix/components/attestations/card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Attestations | card', function (hooks) {
  setupIntlRenderingTest(hooks);

  const attestationTypes = [
    'EDUCOLLAB',
    'EDUCULTURENUM',
    'EDUDOC',
    'EDUIA',
    'EDUINCONTOURNABLES',
    'EDURESSOURCES',
    'EDUSECU',
    'EDUSUPPORT',
    'EDUVEILLE',
    'MINARM',
    'PARENTHOOD',
    'SIXTH_GRADE',
  ];

  attestationTypes.forEach((type) => {
    test(`it renders attestation card with ${type} type`, async function (assert) {
      const obtainedAt = '2025-01-15';

      const downloadAttestation = () => {};

      const screen = await render(
        <template>
          <AttestationCard @type={{type}} @obtainedAt={{obtainedAt}} @downloadAttestation={{downloadAttestation}} />
        </template>,
      );

      const expectedTitle = t(`components.campaigns.attestation-result.title.${type}`);
      assert.dom(screen.getByRole('heading', { level: 2 })).hasText(expectedTitle);
    });
  });

  test('it displays correct SVG for PARENTHOOD type', async function (assert) {
    const type = 'PARENTHOOD';
    const obtainedAt = '2025-01-15';
    const downloadAttestation = () => {};

    await render(
      <template>
        <AttestationCard @type={{type}} @obtainedAt={{obtainedAt}} @downloadAttestation={{downloadAttestation}} />
      </template>,
    );

    assert.dom('img').hasAttribute('src', '/images/illustrations/attestations/PARENTHOOD.svg');
  });

  test('it displays correct SVG for SIXTH_GRADE type', async function (assert) {
    const type = 'SIXTH_GRADE';
    const obtainedAt = '2025-01-15';
    const downloadAttestation = () => {};

    await render(
      <template>
        <AttestationCard @type={{type}} @obtainedAt={{obtainedAt}} @downloadAttestation={{downloadAttestation}} />
      </template>,
    );

    assert.dom('img').hasAttribute('src', '/images/illustrations/attestations/SIXTH_GRADE.svg');
  });
});
