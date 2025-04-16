import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Certifications | Certificate information | candidate global level', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it displays the component', async function (assert) {
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
      globalDescriptionLabel: 'Vous êtes capable de tout.',
      globalSummaryLabel: 'Expert de tous les domaines, Pix vous dit bravo !',
    });
    this.set('certification', certification);

    // when
    const screen = await render(hbs`
      <Certifications::CertificateInformation::candidateGlobalLevel @certificate={{this.certification}} />`);

    // then
    assert.dom(screen.getByRole('heading', { name: t('pages.certificate.global-level'), level: 2 })).exists();
    assert.dom(screen.getByText(certification.globalLevelLabel)).exists();
    assert.dom(screen.getByText(certification.globalDescriptionLabel)).exists();
    assert.dom(screen.getByText(certification.globalSummaryLabel)).exists();
  });
});
