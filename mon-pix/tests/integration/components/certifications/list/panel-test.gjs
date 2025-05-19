import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import Panel from 'mon-pix/components/certifications/list/panel';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | panel', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when there is no certifications', function () {
    test('should render a panel which indicate there is no certifications', async function (assert) {
      // given / when
      const screen = await render(<template><Panel /></template>);

      // then
      assert.dom(screen.getByText(t('pages.certifications-list.no-certification.text'))).exists();
    });
  });

  module('when there is some certifications to show', function () {
    test('should render a certifications list', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certification1 = store.createRecord('certification', {
        date: new Date('2018-02-15T15:15:52Z'),
        deliveredAt: new Date('2018-02-17T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
      });
      const certification2 = store.createRecord('certification', {
        date: new Date('2018-02-15T15:15:52Z'),
        deliveredAt: new Date('2018-02-17T15:15:52Z'),
        certificationCenter: 'Université de Paris',
        isPublished: true,
        pixScore: 32,
        status: 'rejected',
        commentForCandidate: 'Vous avez échoué',
      });
      const certifications = [certification1, certification2];

      // when
      const screen = await render(<template><Panel @certifications={{certifications}} /></template>);

      // then
      assert.dom(screen.getByText('Centre de certification : Université de Paris')).exists();
      assert.dom(screen.getByText('Centre de certification : Université de Lyon')).exists();
      assert.dom(screen.getByText('Non-obtenue')).exists();
      assert.dom(screen.getByText('Obtenue')).exists();
    });
  });
});
