import { render } from "@1024pix/ember-testing-library";
import { module, test } from "qunit";

import { setupRenderingTest } from "ember-qunit";
import ModulixFeedback from "mon-pix/components/module/feedback";

module("Integration | Component | Module | Feedback", function (hooks) {
  setupRenderingTest(hooks);
  test("should display feedback information", async function(assert) {
    // when
    const screen = await render(
    <template>
      <ModulixFeedback @answerIsValid={{true}}>
        <span class='feedback__state'>Correct!</span><p>C'est la bonne réponse !</p>
      </ModulixFeedback>
    </template>);

    // then
    assert.dom(screen.getByText('Correct!')).exists()
    assert.dom(screen.getByText('C\'est la bonne réponse !')).exists()
  });
});
