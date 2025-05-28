import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import Item from 'mon-pix/components/certifications/list/item';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubCurrentUserService } from '../../../../helpers/service-stubs';
import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | item', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when the certification is not published', function () {
    test('should display specific information', async function (assert) {
      //given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        date: new Date('2018-02-15T15:15:52Z'),
        deliveredAt: new Date('2018-02-17T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: false,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
      });

      // when
      const screen = await render(<template><Item @certification={{certification}} /></template>);

      // then
      assert.ok(screen.getByText(t('pages.certifications-list.statuses.not-published')));
      assert.dom(screen.queryByText(t('pages.certifications-list.buttons.details'))).doesNotExist();
      assert
        .dom(screen.queryByRole('button', { name: t('pages.certifications-list.buttons.download-attestation') }))
        .doesNotExist();
    });
  });

  module('when the certification is published', function () {
    module('when the certification is rejected', function () {
      test('should display specific information', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const certification = store.createRecord('certification', {
          date: new Date('2018-02-15T15:15:52Z'),
          deliveredAt: new Date('2018-02-17T15:15:52Z'),
          certificationCenter: 'Université de Lyon',
          isPublished: true,
          pixScore: 34,
          status: 'rejected',
          commentForCandidate: 'Vous avez échoué',
        });

        // when
        const screen = await render(<template><Item @certification={{certification}} /></template>);

        // then
        assert.ok(screen.getByText(t('pages.certifications-list.statuses.rejected')));
        assert.ok(screen.getByText('Commentaire : Vous avez échoué'));
        assert.dom(screen.queryByText('34')).doesNotExist();
        assert.dom(screen.queryByText(t('pages.certifications-list.buttons.details'))).doesNotExist();
        assert
          .dom(screen.queryByRole('button', { name: t('pages.certifications-list.buttons.download-attestation') }))
          .doesNotExist();
      });
    });

    module('when the certification is validated', function () {
      test('should display specific information', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const certification = store.createRecord('certification', {
          date: new Date('2018-02-15T15:15:52Z'),
          deliveredAt: new Date('2018-02-17T15:15:52Z'),
          certificationCenter: 'Université de Lyon',
          isPublished: true,
          pixScore: 654,
          status: 'validated',
          commentForCandidate: null,
        });

        // when
        const screen = await render(<template><Item @certification={{certification}} /></template>);

        // then
        assert.ok(screen.getByText(t('pages.certifications-list.statuses.validated')));
        assert.ok(screen.getByText('654'));
        assert.ok(screen.getByText(t('pages.certifications-list.buttons.details')));
        assert.ok(screen.getByRole('button', { name: t('pages.certifications-list.buttons.download-attestation') }));
      });

      module('when there is an error during the download of the attestation', function () {
        test('should show the common error message', async function (assert) {
          // given
          stubCurrentUserService(this.owner);
          const fileSaverSaveStub = sinon.stub();

          class FileSaverStub extends Service {
            save = fileSaverSaveStub;
          }

          this.owner.register('service:fileSaver', FileSaverStub);

          fileSaverSaveStub.rejects(new Error('an error message'));

          const store = this.owner.lookup('service:store');
          const certification = store.createRecord('certification', {
            date: new Date('2018-02-15T15:15:52Z'),
            deliveredAt: new Date('2018-02-17T15:15:52Z'),
            certificationCenter: 'Université de Lyon',
            isPublished: true,
            pixScore: 654,
            status: 'validated',
            commentForCandidate: null,
          });
          this.set('certification', certification);
          const screen = await render(<template><Item @certification={{certification}} /></template>);

          // when
          await click(
            screen.getByRole('button', { name: t('pages.certifications-list.buttons.download-attestation') }),
          );

          // then
          assert.ok(screen.getByText(t('common.error')));
        });
      });
    });

    module('when the certification is cancelled', function () {
      test('should display specific information', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const certification = store.createRecord('certification', {
          date: new Date('2018-02-15T15:15:52Z'),
          deliveredAt: new Date('2018-02-17T15:15:52Z'),
          certificationCenter: 'Université de Lyon',
          isPublished: true,
          pixScore: 365,
          status: 'cancelled',
          commentForCandidate: 'Votre certification a été annulée',
        });

        // when
        const screen = await render(<template><Item @certification={{certification}} /></template>);

        // then
        assert.ok(screen.getByText(t('pages.certifications-list.statuses.cancelled')));
        assert.ok(screen.getByText('Commentaire : Votre certification a été annulée'));
        assert.dom(screen.queryByText('365')).doesNotExist();
        assert.dom(screen.queryByText(t('pages.certifications-list.buttons.details'))).doesNotExist();
        assert
          .dom(screen.queryByRole('button', { name: t('pages.certifications-list.buttons.download-attestation') }))
          .doesNotExist();
      });
    });

    module('when the certification is rejected or cancelled without comment', function () {
      test('should not display the details and download button', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const certification = store.createRecord('certification', {
          date: new Date('2018-02-15T15:15:52Z'),
          deliveredAt: new Date('2018-02-17T15:15:52Z'),
          certificationCenter: 'Université de Lyon',
          isPublished: true,
          pixScore: 34,
          status: 'rejected',
          commentForCandidate: null,
        });

        // when
        const screen = await render(<template><Item @certification={{certification}} /></template>);

        // then
        assert.ok(screen.getByText(t('pages.certifications-list.statuses.rejected')));
        assert.dom(screen.queryByText(t('pages.certifications-list.comment'))).doesNotExist();
        assert.dom(screen.queryByText(t('pages.certifications-list.buttons.details'))).doesNotExist();
        assert
          .dom(screen.queryByRole('button', { name: t('pages.certifications-list.buttons.download-attestation') }))
          .doesNotExist();
      });
    });
  });

  module('when algorithm engine version is v2', function () {
    test('should display a download button with attestation word', async function (assert) {
      //given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        date: new Date('2018-02-15T15:15:52Z'),
        deliveredAt: new Date('2018-02-17T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
        algorithmEngineVersion: 2,
      });

      // when
      const screen = await render(<template><Item @certification={{certification}} /></template>);

      // then
      assert.ok(screen.getByRole('button', { name: t('pages.certifications-list.buttons.download-attestation') }));
    });
  });

  module('when algorithm engine version is v3', function () {
    test('should display a download button with certificate word', async function (assert) {
      //given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        date: new Date('2018-02-15T15:15:52Z'),
        deliveredAt: new Date('2018-02-17T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
        algorithmEngineVersion: 3,
      });

      // when
      const screen = await render(<template><Item @certification={{certification}} /></template>);

      // then
      assert.ok(screen.getByRole('button', { name: t('pages.certifications-list.buttons.download-certificate') }));
    });
  });
});
