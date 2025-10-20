import { render } from '@1024pix/ember-testing-library';
// eslint-disable-next-line no-restricted-imports
import { find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | formatted-solution.js', function (hooks) {
  setupIntlRenderingTest(hooks);
  let solutionToDisplay;

  test('should display the provided solution', async function (assert) {
    // Given
    solutionToDisplay = 'patate';
    this.set('solutionToDisplay', solutionToDisplay);

    // When
    await render(
      hbs`<SolutionPanel::FormattedSolution class='solution' @solutionToDisplay={{this.solutionToDisplay}} />`,
    );

    // Then
    assert.dom('.solution').hasText(solutionToDisplay);
  });

  module('when solution has a new line', function () {
    test('should display the new line', async function (assert) {
      // Given
      solutionToDisplay = 'patate\nau\nfromage';
      this.set('solutionToDisplay', solutionToDisplay);

      // When
      await render(
        hbs`<SolutionPanel::FormattedSolution class='solution' @solutionToDisplay={{this.solutionToDisplay}} />`,
      );

      // Then
      const solution = find('.solution');
      assert.dom(solution).hasText(solutionToDisplay);
      assert.dom(solution).containsHtml('<br>');
    });
  });
});
