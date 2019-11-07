import { module, test } from 'qunit';
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { createUserWithMembership } from '../helpers/test-init';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Session Update', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async () => {
    const user = createUserWithMembership();

    await authenticateSession({
      user_id: user.id,
      access_token: 'aaa.' + btoa(`{"user_id":${user.id},"source":"pix","iat":1545321469,"exp":4702193958}`) + '.bbb',
      expires_in: 3600,
      token_type: 'Bearer token type',
    });
  });

  test('it should allow to update a session and redirect to the session #1 details', async function(assert) {
    // given
    const session = server.create('session', { id: 1, date: '2010-10-12', time: '13:00' });
    const newRoom = 'New room';
    const newExaminer = 'New examiner';

    await visit(`/sessions/${session.id}/modification`);
    await fillIn('#session-room', newRoom);
    await fillIn('#session-examiner', newExaminer);

    // when
    await click('button[type="submit"]');

    // then
    assert.equal(server.db.sessions.find(1).room, newRoom);
    assert.equal(server.db.sessions.find(1).examiner, newExaminer);
    assert.equal(currentURL(), `/sessions/${session.id}`);
  });

  test('it should not update a session when cancel button is clicked and redirect to the session #1 details', async function(assert) {
    // given
    const session = server.create('session', { id: 1, room: 'current room', examiner: 'current examiner', date: '2010-10-12', time: '13:00' });
    const newRoom = 'New room';
    const newExaminer = 'New examiner';

    await visit(`/sessions/${session.id}/modification`);
    await fillIn('#session-room', newRoom);
    await fillIn('#session-examiner', newExaminer);

    // when
    await click('button[data-action="cancel"]');

    // then
    assert.equal(server.db.sessions.find(1).room, 'current room');
    assert.equal(server.db.sessions.find(1).examiner, 'current examiner');
    assert.equal(currentURL(), `/sessions/${session.id}`);
  });
});
