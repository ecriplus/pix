import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering.js';

module('Integration | Component | combined course item', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('duration', function () {
    test('should display duration on item if exists', async function (assert) {
      // given
      const onClickStub = sinon.stub();
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'mon module',
        reference: 'mon-module',
        type: 'MODULE',
        isLocked: false,
        duration: 10,
      });

      this.setProperties({ combinedCourseItem, onClickStub });
      // when
      const screen = await render(hbs`
        <CombinedCourse::CombinedCourseItem
          @item={{this.combinedCourseItem}}
          @isLocked={{this.combinedCourseItem.isLocked}}
          @isNextItemToComplete={{false}}
          @onClick={{this.onClickStub}}
        />`);

      //then
      assert.ok(screen.getByText(/10 min/));
    });

    test('should not display duration on item if it does not exists', async function (assert) {
      // given

      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'mon module',
        reference: 'mon-module',
        type: 'MODULE',
      });
      const onClickStub = sinon.stub();
      this.setProperties({ combinedCourseItem, onClickStub });
      // when
      const screen = await render(hbs`
        <CombinedCourse::CombinedCourseItem
          @item={{this.combinedCourseItem}}
          @isLocked={{this.combinedCourseItem.isLocked}}
          @isNextItemToComplete={{false}}
          @onClick={{this.onClickStub}}
        />`);

      //then
      assert.notOk(screen.queryByText(t('pages.combined-courses.items.durationUnit')));
    });
  });

  module('image', function () {
    test('should return default campaign image on type CAMPAIGN', async function (assert) {
      // given
      const onClickStub = sinon.stub();
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'ma campagne',
        reference: 'ma-campagne',
        type: 'CAMPAIGN',
        isLocked: false,
      });

      this.setProperties({ combinedCourseItem, onClickStub });
      // when
      const screen = await render(hbs`
        <CombinedCourse::CombinedCourseItem
          @item={{this.combinedCourseItem}}
          @isLocked={{this.combinedCourseItem.isLocked}}
          @isNextItemToComplete={{false}}
          @onClick={{this.onClickStub}}
        />`);

      //then
      assert.ok(screen.getByRole('presentation').hasAttribute('src', '/images/combined-course/campaign-icon.svg'));
    });

    test('should return image from module on type MODULE', async function (assert) {
      // given
      const onClickStub = sinon.stub();
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'ma campagne',
        reference: 'ma-campagne',
        type: 'MODULE',
        image: 'my-awesome-img.svg',
        isLocked: false,
      });

      this.setProperties({ combinedCourseItem, onClickStub });
      // when
      const screen = await render(hbs`
        <CombinedCourse::CombinedCourseItem
          @item={{this.combinedCourseItem}}
          @isLocked={{this.combinedCourseItem.isLocked}}
          @isNextItemToComplete={{false}}
          @onClick={{this.onClickStub}}
        />`);

      //then
      assert.ok(screen.getByRole('presentation').hasAttribute('src', 'my-awesome-img.svg'));
    });
  });
});
