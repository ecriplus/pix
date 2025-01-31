import { clickByText, visit } from '@1024pix/ember-testing-library';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupApplicationTest, t } from '../helpers';
import identifyLearner from '../helpers/identify-learner';

module('Acceptance | End mission', function (hooks) {
  setupApplicationTest(hooks);

  test('displays mission validated objectives', async function (assert) {
    // given
    const mission = this.server.create('mission');
    const assessment = this.server.create('assessment', {
      missionId: mission.id,
      result: {
        global: 'exceeded',
        steps: ['reached'],
        dare: 'reached',
      },
    });
    identifyLearner(this.owner);

    // when
    const screen = await visit(`/assessments/${assessment.id}/results`);

    // then
    assert.dom(screen.getByText('Recherche sur internet')).exists();
    assert.dom(screen.getByText('validatedObjectives')).exists();
    assert.dom(screen.getByText(t('pages.missions.end-page.back-to-missions'))).exists();
  });

  test('when mission goal has been exceeded', async function (assert) {
    const mission = this.server.create('mission');
    const assessment = this.server.create('assessment', { missionId: mission.id, result: { global: 'exceeded' } });
    identifyLearner(this.owner);
    const screen = await visit(`/assessments/${assessment.id}/results`);
    assert.dom(screen.getByText(t('pages.missions.feedback.result.exceeded.robot-text.0'))).exists();
    assert.dom(screen.getByText(t('pages.missions.feedback.result.exceeded.robot-text.1'))).exists();
  });

  test('when mission goal has been reached', async function (assert) {
    const mission = this.server.create('mission');
    const assessment = this.server.create('assessment', {
      missionId: mission.id,
      result: { global: 'reached' },
    });
    identifyLearner(this.owner);
    const screen = await visit(`/assessments/${assessment.id}/results`);
    assert.dom(screen.getByText(t('pages.missions.feedback.result.reached.robot-text.0'))).exists();
    assert.dom(screen.getByText(t('pages.missions.feedback.result.reached.robot-text.1'))).exists();
  });

  test('when mission goal has been partially reached', async function (assert) {
    const mission = this.server.create('mission');
    const assessment = this.server.create('assessment', {
      missionId: mission.id,
      result: { global: 'partially-reached' },
    });
    identifyLearner(this.owner);
    const screen = await visit(`/assessments/${assessment.id}/results`);
    assert.dom(screen.getByText(t('pages.missions.feedback.result.partially-reached.robot-text.0'))).exists();
    assert.dom(screen.getByText(t('pages.missions.feedback.result.partially-reached.robot-text.1'))).exists();
  });

  test('when mission goal has not been reached', async function (assert) {
    const mission = this.server.create('mission');
    const assessment = this.server.create('assessment', {
      missionId: mission.id,
      result: { global: 'not-reached' },
    });
    identifyLearner(this.owner);
    const screen = await visit(`/assessments/${assessment.id}/results`);
    assert.dom(screen.getByText(t('pages.missions.feedback.result.not-reached.robot-text.0'))).exists();
    assert.dom(screen.getByText(t('pages.missions.feedback.result.not-reached.robot-text.1'))).exists();
  });

  test('redirect to home page after clicking on return button', async function (assert) {
    // given
    const mission = this.server.create('mission');
    const assessment = this.server.create('assessment', {
      missionId: mission.id,
      result: {
        global: 'reached',
      },
    });
    identifyLearner(this.owner);

    // when
    await visit(`/assessments/${assessment.id}/results`);
    await clickByText(t('pages.missions.end-page.back-to-missions'));

    // then
    assert.strictEqual(currentURL(), '/');
  });
});
