import { render, within } from '@1024pix/ember-testing-library';
import dayjs from 'dayjs';
import { t } from 'ember-intl/test-support';
import UserCertificationCourses from 'pix-admin/components/users/user-certification-courses';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Users | User certification courses', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;
  const userId = 1;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');

    const serviceRouter = this.owner.lookup('service:router');
    sinon.stub(serviceRouter, 'currentRoute').value({ parent: { params: { user_id: userId } } });
  });

  module('When user has no certification course', function () {
    test('displays a title and an info', async function (assert) {
      // given
      sinon.stub(store, 'query').resolves([]);

      // when
      const screen = await render(<template><UserCertificationCourses /></template>);

      // then
      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.users.certification-centers.certification-courses.section-title'),
          }),
        )
        .exists();

      assert
        .dom(screen.getByText(t('components.users.certification-centers.certification-courses.empty-table')))
        .exists();
    });
  });

  module('When user has certification courses', function () {
    test('displays a table with a table of certification courses', async function (assert) {
      // given
      const certificationCourse = store.createRecord('user-certification-course', {
        id: 1,
        sessionId: 23,
        createdAt: new Date('2025-04-01'),
        isPublished: true,
      });
      const certificationCourse2 = store.createRecord('user-certification-course', {
        isPublished: false,
      });

      sinon.stub(store, 'query').resolves([certificationCourse, certificationCourse2]);

      // when
      const screen = await render(<template><UserCertificationCourses /></template>);

      // then
      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.users.certification-centers.certification-courses.section-title'),
          }),
        )
        .exists();

      const idCell = screen.getByRole('cell', { name: certificationCourse.id });
      assert.dom(within(idCell).getByRole('link', { name: certificationCourse.id })).exists();

      assert
        .dom(screen.getByRole('cell', { name: dayjs(certificationCourse.createdAt).format('DD/MM/YYYY') }))
        .exists();

      const sessionIdCell = screen.getByRole('cell', { name: certificationCourse.sessionId });
      assert.dom(within(sessionIdCell).getByRole('link', { name: certificationCourse.sessionId })).exists();

      assert.dom(screen.getByRole('cell', { name: t('pages.certifications.session-state.published') })).exists();
      assert.dom(screen.getByRole('cell', { name: t('pages.certifications.session-state.not-published') })).exists();
    });
  });
});
