import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Services | ModuleIssueReport', function (hooks) {
  setupTest(hooks);

  module('#initialize', function () {
    test('should save a passage id and a module id', function (assert) {
      // given
      const service = this.owner.lookup('service:moduleIssueReport');

      // when
      service.initialize({ passageId: '1984', moduleId: 'a1514ac2-b76d-45fd-a6f1-6573f5d1c2ac' });

      // then
      assert.strictEqual(service.passageId, '1984');
      assert.strictEqual(service.moduleId, 'a1514ac2-b76d-45fd-a6f1-6573f5d1c2ac');
    });
  });

  module('#record', function () {
    test('it should record a module issue report', async function (assert) {
      // given
      const passageId = 1;
      const moduleId = 'a1514ac2-b76d-45fd-a6f1-6573f5d1c2ac';
      const elementId = 'b37e8e8d-9875-4b15-85c0-0373ffbb0805';
      const answer = 42;
      const categoryKey = 'accessibility';
      const comment = 'no comment...';

      const moduleIssueReportService = this.owner.lookup('service:moduleIssueReport');

      const requestManager = this.owner.lookup('service:request-manager');
      const requestStub = sinon.stub(requestManager, 'request');
      moduleIssueReportService.initialize({ passageId, moduleId });

      // when
      await moduleIssueReportService.record({
        elementId,
        answer,
        categoryKey,
        comment,
      });

      // then
      sinon.assert.calledWithExactly(requestStub, {
        url: 'http://localhost:3000/api/module-issue-reports',
        method: 'POST',
        body: JSON.stringify({
          data: {
            attributes: {
              'module-id': moduleId,
              'passage-id': passageId,
              'element-id': elementId,
              answer,
              'category-key': categoryKey,
              comment,
            },
            type: 'module-issue-reports',
          },
        }),
      });
      assert.ok(true);
    });
  });
});
