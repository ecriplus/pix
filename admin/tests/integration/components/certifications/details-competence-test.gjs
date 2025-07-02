import { render } from '@1024pix/ember-testing-library';
import { setupRenderingTest } from 'ember-qunit';
import DetailsCompetence from 'pix-admin/components/certifications/details-competence';
import { module, test } from 'qunit';

module('Integration | Component | certifications/details-competence', function (hooks) {
  setupRenderingTest(hooks);

  const answer = (result) => {
    return {
      skill: '@skill1',
      challengeId: 'rec12345',
      order: '1',
      result: result,
    };
  };

  const competence = (answers = {}, competenceData = {}) => {
    const { answer1, answer2, answer3 } = answers;
    const { positionedLevel = 3, positionedScore = 25, obtainedLevel = -1, obtainedScore = 0 } = competenceData;
    return {
      name: 'Une compétence',
      index: '1.1',
      positionedLevel,
      positionedScore,
      obtainedLevel,
      obtainedScore,
      answers: [answer(answer1), answer(answer2), answer(answer3)],
    };
  };

  test('it renders', async function (assert) {
    // given
    const competenceData = competence({ answer1: 'ok', answer2: 'ko' });

    // when
    const screen = await render(<template><DetailsCompetence @competence={{competenceData}} rate={{60}} /></template>);

    // then
    assert.dom(screen.getByText('1.1 Une compétence')).exists();
    assert.dom(screen.getByLabelText('Jauge de compétences positionnées')).exists();
    assert.dom(screen.getByLabelText('Jauge de compétences certifiées')).exists();
  });

  test('it should compute widths correctly', async function (assert) {
    // given
    const competenceData = competence(
      { answer1: 'ok', answer2: 'ok', answer3: 'ko' },
      {
        positionedLevel: 3,
        positionedScore: 25,
        obtainedLevel: 2,
        obtainedScore: 17,
      },
    );

    // when
    const screen = await render(<template><DetailsCompetence @competence={{competenceData}} /></template>);

    // then - check that the positioned and certified progress bars have correct widths
    const positionedProgressBar = screen.getByRole('progressbar', { name: 'Jauge de compétences positionnées' });
    const certifiedProgressBar = screen.getByRole('progressbar', { name: 'Jauge de compétences certifiées' });

    // positionedWidth should be (3 / 8) * 100 = 37.5% rounded = 38%
    const expectedPositionedWidth = 'width:' + Math.round((3 / 8) * 100) + '%';
    // certifiedWidth should be (2 / 8) * 100 = 25%
    const expectedCertifiedWidth = 'width:' + Math.round((2 / 8) * 100) + '%';

    assert.dom(positionedProgressBar).hasAttribute('style', expectedPositionedWidth);
    assert.dom(certifiedProgressBar).hasAttribute('style', expectedCertifiedWidth);
  });

  test('it should display answers from competence', async function (assert) {
    // given
    const competenceData = competence({ answer1: 'ok', answer2: 'aband', answer3: 'ko' });

    // when
    const screen = await render(<template><DetailsCompetence @competence={{competenceData}} /></template>);

    // then - check that all answers are displayed with correct result indicators
    const skillElements = screen.getAllByText('@skill1');
    const challengeElements = screen.getAllByText('rec12345');

    // Should display 3 answers with the same skill and challenge ID
    assert.strictEqual(skillElements.length, 3, 'Should display 3 answers with @skill1');
    assert.strictEqual(challengeElements.length, 3, 'Should display 3 answers with rec12345');
  });
});
