import { render, within } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Certifications | Shareable certificate | v3-certificate', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it displays v3 certificate information', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const certification = store.createRecord('certification', {
      birthdate: '2000-01-22',
      birthplace: 'Paris',
      firstName: 'Jean',
      lastName: 'Bon',
      certificationDate: new Date('2018-02-15T15:15:52Z'),
      deliveredAt: new Date('2018-02-17T15:15:52Z'),
      certificationCenter: 'Université de Lyon',
      pixScore: 654,
      resultCompetenceTree: store.createRecord('result-competence-tree'),
      maxReachableLevelOnCertificationDate: new Date('2018-02-15T15:15:52Z'),
      globalLevelLabel: 'Expert 1',
    });
    this.set('certification', certification);

    // when
    const screen = await render(hbs`
      <Certifications::ShareableCertificate::v3Certificate @certificate={{this.certification}} />`);

    // then
    assert.dom(screen.getByRole('heading', { level: 1, name: t('pages.certificate.title') })).exists();
    assert
      .dom(
        within(screen.getByRole('navigation')).getByRole('link', {
          name: t('pages.fill-in-certificate-verification-code.title'),
        }),
      )
      .exists();
    const globalLevelLabels = screen.getAllByText(certification.globalLevelLabel);
    assert.strictEqual(globalLevelLabels.length, 2);
  });
});
