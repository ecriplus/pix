import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Adapter | PassageEventsCollection', function (hooks) {
  setupTest(hooks);

  module('#urlForCreateRecord', function () {
    test('should use custom url when creating passage-event-collection', function (assert) {
      // given
      const adapter = this.owner.lookup('adapter:passage-events-collection');

      // when
      const url = adapter.urlForCreateRecord();

      // then
      assert.true(url.endsWith('/api/passage-events'));
    });
  });
});
