import { setupTest } from 'ember-qunit';
import { CREATED, PROCESSED } from 'pix-admin/models/session';
import { module, test } from 'qunit';

module('Unit | Model | session', function (hooks) {
  setupTest(hooks);

  let store;

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store');
  });

  module('#isFinalized', function () {
    module('when the status is PROCESSED', function () {
      test('isFinalized should be true', function (assert) {
        // given
        const sessionProcessed = store.createRecord('session', { status: PROCESSED });

        // when
        const isFinalized = sessionProcessed.get('isFinalized');

        // then
        assert.true(isFinalized);
      });
    });

    module('when the status is CREATED', function () {
      test('isFinalized should be false', function (assert) {
        // given
        const sessionStarted = store.createRecord('session', { status: CREATED });

        // when
        const isFinalized = sessionStarted.get('isFinalized');

        // then
        assert.false(isFinalized);
      });
    });
  });

  module('#hasExaminerGlobalComment', function () {
    module('when there is no examinerGlobalComment', function () {
      test('it should return false', function (assert) {
        // given
        const session = store.createRecord('session', { examinerGlobalComment: null });

        // when
        const hasExaminerGlobalComment = session.hasExaminerGlobalComment;

        // then
        assert.false(hasExaminerGlobalComment);
      });
    });

    module('when there is a examinerGlobalComment with only whitespaces', function () {
      test('it should also return false', function (assert) {
        // given
        const session = store.createRecord('session', { examinerGlobalComment: '   ' });

        // when
        const hasExaminerGlobalComment = session.hasExaminerGlobalComment;

        // then
        assert.false(hasExaminerGlobalComment);
      });
    });

    module('when there is an examinerGlobalComment', function () {
      test('it should return true', function (assert) {
        // given
        const session = store.createRecord('session', { examinerGlobalComment: 'salut' });

        // when
        const hasExaminerGlobalComment = session.hasExaminerGlobalComment;

        // then
        assert.true(hasExaminerGlobalComment);
      });
    });
  });

  module('#hasComplementaryInfo', function () {
    module('when hasIncident is false', function () {
      test('it should return false', function (assert) {
        // given
        const session = store.createRecord('session', {
          hasIncident: false,
        });

        // when
        const hasComplementaryInfo = session.hasComplementaryInfo;

        // then
        assert.false(hasComplementaryInfo);
      });
    });

    module('when hasJoiningIssue is false', function () {
      test('it should also return false', function (assert) {
        // given
        const session = store.createRecord('session', { hasJoiningIssue: false });

        // when
        const hasComplementaryInfo = session.hasComplementaryInfo;

        // then
        assert.false(hasComplementaryInfo);
      });
    });

    module('when hasIncident & hasJoiningIssue are true', function () {
      test('it should return true', function (assert) {
        // given
        const session = store.createRecord('session', { hasJoiningIssue: true, hasIncident: true });

        // when
        const hasComplementaryInfo = session.hasComplementaryInfo;

        // then
        assert.true(hasComplementaryInfo);
      });
    });
  });

  module('#isPublished', function () {
    module('when the session has no publication date', function () {
      test('isPublished should be false', function (assert) {
        // given
        const unprocessedSession = store.createRecord('session', { publishedAt: null });

        // when
        const isPublished = unprocessedSession.get('isPublished');

        // then
        assert.false(isPublished);
      });
    });

    module('when the session has a publication date ', function () {
      test('isPublished should be true', function (assert) {
        // given
        const processedSession = store.createRecord('session', { publishedAt: '2020-01-01' });

        // when
        const isPublished = processedSession.get('isPublished');

        // then
        assert.true(isPublished);
      });
    });
  });

  module('#displayStatus', function () {
    module('when status is created', function () {
      test('it should display created printable equivalent', function (assert) {
        // given
        const session = store.createRecord('session', { status: 'created' });

        // when
        const displayStatus = session.displayStatus;

        // then
        assert.strictEqual(displayStatus, 'Créée');
      });
    });

    module('when status is finalized', function () {
      test('it should display finalized printable equivalent', function (assert) {
        // given
        const session = store.createRecord('session', { status: 'finalized' });

        // when
        const displayStatus = session.displayStatus;

        // then
        assert.strictEqual(displayStatus, 'Finalisée');
      });
    });

    module('when status is processed', function () {
      test('it should display processed printable equivalent', function (assert) {
        // given
        const session = store.createRecord('session', { status: 'processed' });

        // when
        const displayStatus = session.displayStatus;

        // then
        assert.strictEqual(displayStatus, 'Résultats transmis par Pix');
      });
    });
  });
});
