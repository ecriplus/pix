import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupApplicationTest, t } from '../helpers';

module('Acceptance | FeedBack', function (hooks) {
  setupApplicationTest(hooks);
  module('when user click on the button', function () {
    test('redirects to the result page', async function (assert) {
      const mission = this.server.create('mission');
      const assessment = this.server.create('assessment', {
        missionId: mission.id,
        result: {
          global: 'reached',
        },
      });

      // when
      const screen = await visit(`/assessments/${assessment.id}/feedback`);
      await click(screen.getByRole('button'));

      // then
      assert.ok(currentURL().includes('result'));
    });

    [
      {
        assessment: {
          result: {
            global: 'exceeded',
          },
        },
        expectedTradution: [
          'pages.missions.feedback.result.exceeded.robot-text.0',
          'pages.missions.feedback.result.exceeded.robot-text.1',
        ],
      },
      {
        assessment: {
          result: {
            global: 'reached',
          },
        },
        expectedTradution: [
          'pages.missions.feedback.result.reached.robot-text.0',
          'pages.missions.feedback.result.reached.robot-text.1',
        ],
      },
      {
        assessment: {
          result: {
            global: 'not-reached',
          },
        },
        expectedTradution: [
          'pages.missions.feedback.result.not-reached.robot-text.0',
          'pages.missions.feedback.result.not-reached.robot-text.1',
        ],
      },
      {
        assessment: {
          result: {
            global: 'partially-reached',
          },
        },
        expectedTradution: [
          'pages.missions.feedback.result.partially-reached.robot-text.0',
          'pages.missions.feedback.result.partially-reached.robot-text.1',
        ],
      },
    ].forEach(({ assessment, expectedTradution }) => {
      test(`Should display the traduction for ${assessment.result.global} result`, async function (assert) {
        const mission = this.server.create('mission');
        const dynamicAssessment = this.server.create('assessment', {
          missionId: mission.id,
          result: {
            global: assessment.result.global,
          },
        });

        // when
        const screen = await visit(`/assessments/${dynamicAssessment.id}/feedback`);

        assert.dom(screen.getByText(t(expectedTradution[0]))).exists();
        assert.dom(screen.getByText(t(expectedTradution[1]))).exists();
      });
    });
  });
});
