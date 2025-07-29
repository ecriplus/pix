import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import ModuleQcuDeclarative from 'mon-pix/components/module/element/qcu-declarative';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QCUDeclarative', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display an instruction, a complementary instruction and a list of proposals', async function (assert) {
    // given
    const qcuDeclarativeElement = _getQcuDeclarativeElement();
    const { complementaryInstruction, proposals } = qcuDeclarativeElement;

    // when
    const screen = await render(<template><ModuleQcuDeclarative @element={{qcuDeclarativeElement}} /></template>);

    // then
    assert.ok(screen.getByText('De quoi le ‘oui‘ a-t-il besoin pour gagner ?'));
    assert.ok(screen.getByText(complementaryInstruction));
    assert.ok(screen.getByRole('button', { name: proposals[0].content }));
    assert.ok(screen.getByRole('button', { name: proposals[1].content }));
    assert.ok(screen.getByRole('button', { name: proposals[2].content }));
  });

  module('when user clicks on one of the proposals', function () {
    test('it should show feedback, disable proposal buttons and send an event', async function (assert) {
      // given
      const passageEventService = this.owner.lookup('service:passageEvents');
      const passageEventRecordStub = sinon.stub(passageEventService, 'record');
      const onAnswerStub = sinon.stub();

      const qcuDeclarativeElement = _getQcuDeclarativeElement();
      const { proposals } = qcuDeclarativeElement;

      // when
      const screen = await render(
        <template><ModuleQcuDeclarative @element={{qcuDeclarativeElement}} @onAnswer={{onAnswerStub}} /></template>,
      );
      const button1 = screen.getByRole('button', { name: proposals[0].content });
      await click(button1);

      // then
      const button2 = screen.getByRole('button', { name: proposals[1].content });
      const button3 = screen.getByRole('button', { name: proposals[2].content });
      assert.dom(button1).isDisabled();
      assert.dom(button2).isDisabled();
      assert.dom(button3).isDisabled();
      assert.ok(screen.getByText("C'est l'approche de la plupart des gens."));
      sinon.assert.calledWithExactly(passageEventRecordStub, {
        type: 'QCU_DECLARATIVE_ANSWERED',
        data: {
          elementId: qcuDeclarativeElement.id,
          answer: proposals[0].content,
        },
      });
    });
    test('it should call "onAnswer" function pass as argument', async function (assert) {
      // given
      const passageEventService = this.owner.lookup('service:passageEvents');
      sinon.stub(passageEventService, 'record');
      const onAnswerStub = sinon.stub();

      const qcuDeclarativeElement = _getQcuDeclarativeElement();
      const { proposals } = qcuDeclarativeElement;

      // when
      const screen = await render(
        <template><ModuleQcuDeclarative @element={{qcuDeclarativeElement}} @onAnswer={{onAnswerStub}} /></template>,
      );
      const button1 = screen.getByRole('button', { name: proposals[0].content });
      await click(button1);

      // then
      sinon.assert.calledWithExactly(onAnswerStub, {
        element: qcuDeclarativeElement,
      });
      assert.ok(true);
    });
  });
});

function _getQcuDeclarativeElement() {
  const instruction = '<p>De quoi le ‘oui‘ a-t-il besoin pour gagner ?</p>';
  const complementaryInstruction = 'Il n’y a pas de bonne ou de mauvaise réponse.';

  const proposals = [
    {
      id: '1',
      content: 'Du ‘oui‘',
      feedback: {
        diagnosis: "<p>C'est l'approche de la plupart des gens.</p>",
      },
    },
    {
      id: '2',
      content: 'Du ‘non‘',
      feedback: {
        diagnosis: '<p>Possible, mais attention à ne pas faire une rafarinade !</p>',
      },
    },
    {
      id: '3',
      content: 'Du ‘peut-être‘',
      feedback: {
        diagnosis: '<p>Digne des plus grands acrobates !</p>',
      },
    },
  ];

  return { instruction, complementaryInstruction, proposals };
}
