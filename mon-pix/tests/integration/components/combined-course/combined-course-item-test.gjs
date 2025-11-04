import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import CombinedCourseItem from 'mon-pix/components/combined-course/combined-course-item';
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

      // when
      const screen = await render(
        <template>
          <CombinedCourseItem
            @item={{combinedCourseItem}}
            @isLocked={{combinedCourseItem.isLocked}}
            @isNextItemToComplete={{false}}
            @onClick={{onClickStub}}
          />
        </template>,
      );

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

      // when
      const screen = await render(
        <template>
          <CombinedCourseItem
            @item={{combinedCourseItem}}
            @isLocked={{combinedCourseItem.isLocked}}
            @isNextItemToComplete={{false}}
            @onClick={{onClickStub}}
          />
        </template>,
      );

      //then
      assert.notOk(screen.queryByText(t('pages.combined-courses.items.durationUnit')));
    });
  });

  module('image', function () {
    test('should display default campaign image on type CAMPAIGN', async function (assert) {
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

      // when
      const screen = await render(
        <template>
          <CombinedCourseItem
            @item={{combinedCourseItem}}
            @isLocked={{combinedCourseItem.isLocked}}
            @isNextItemToComplete={{false}}
            @onClick={{onClickStub}}
          />
        </template>,
      );

      //then
      assert.ok(screen.getByRole('presentation').hasAttribute('src', '/images/combined-course/campaign-icon.svg'));
    });

    test('should display image from module on type MODULE', async function (assert) {
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

      // when
      const screen = await render(
        <template>
          <CombinedCourseItem
            @item={{combinedCourseItem}}
            @isLocked={{combinedCourseItem.isLocked}}
            @isNextItemToComplete={{false}}
            @onClick={{onClickStub}}
          />
        </template>,
      );

      //then
      assert.ok(screen.getByRole('presentation').hasAttribute('src', 'my-awesome-img.svg'));
    });

    test('should display image from module on type FORMATION', async function (assert) {
      // given
      const onClickStub = sinon.stub();
      const store = this.owner.lookup('service:store');
      const combinedCourseItem = store.createRecord('combined-course-item', {
        id: 1,
        title: 'ma campagne',
        reference: 'ma-campagne',
        type: 'FORMATION',
        isLocked: false,
      });

      // when
      const screen = await render(
        <template>
          <CombinedCourseItem
            @item={{combinedCourseItem}}
            @isLocked={{combinedCourseItem.isLocked}}
            @isNextItemToComplete={{false}}
            @onClick={{onClickStub}}
          />
        </template>,
      );

      //then
      assert.ok(screen.getByRole('presentation').hasAttribute('src', '/images/formation-book.svg'));
    });
  });
});
