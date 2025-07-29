import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModuleQcuDiscovery from 'mon-pix/components/module/element/qcu-discovery';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QCUDiscovery', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display an instruction, a direction and a list of proposals', async function (assert) {
    // given
    const qcuDiscoveryElement = _getQcuDiscoveryElement();
    const { proposals } = qcuDiscoveryElement;

    // when
    const screen = await render(<template><ModuleQcuDiscovery @element={{qcuDiscoveryElement}} /></template>);

    // then
    assert.ok(screen.getByText('Quel est le dessert classique idéal lors d’un goûter ?'));
    assert.deepEqual(screen.getAllByText(t('pages.modulix.qcuDiscovery.direction')).length, 2);
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

      const qcuDiscoveryElement = _getQcuDiscoveryElement();
      const { proposals } = qcuDiscoveryElement;

      // when
      const screen = await render(
        <template><ModuleQcuDiscovery @element={{qcuDiscoveryElement}} @onAnswer={{onAnswerStub}} /></template>,
      );
      const button1 = screen.getByRole('button', { name: proposals[0].content });
      await click(button1);

      // then
      const button2 = screen.getByRole('button', { name: proposals[1].content });
      const button3 = screen.getByRole('button', { name: proposals[2].content });
      assert.dom(button1).isDisabled();
      assert.dom(button2).isDisabled();
      assert.dom(button3).isDisabled();
      assert.ok(screen.getByText('Il n’y a rien de plus réconfortant que des cookies tout juste sortis du four !'));
      sinon.assert.calledWithExactly(passageEventRecordStub, {
        type: 'QCU_DISCOVERY_ANSWERED',
        data: {
          elementId: qcuDiscoveryElement.id,
          answer: proposals[0].id,
          status: 'ok',
        },
      });
    });

    test('it should call "onAnswer" function pass as argument', async function (assert) {
      // given
      const passageEventService = this.owner.lookup('service:passageEvents');
      sinon.stub(passageEventService, 'record');
      const onAnswerStub = sinon.stub();

      const qcuDiscoveryElement = _getQcuDiscoveryElement();
      const { proposals } = qcuDiscoveryElement;

      // when
      const screen = await render(
        <template><ModuleQcuDiscovery @element={{qcuDiscoveryElement}} @onAnswer={{onAnswerStub}} /></template>,
      );
      const button1 = screen.getByRole('button', { name: proposals[0].content });
      await click(button1);

      // then
      sinon.assert.calledWithExactly(onAnswerStub, {
        element: qcuDiscoveryElement,
      });
      assert.ok(true);
    });
  });
});

function _getQcuDiscoveryElement() {
  const instruction = '<p>Quel est le dessert classique idéal lors d’un goûter&nbsp;?</p>';
  const solution = '1';

  const proposals = [
    {
      id: '1',
      content: 'Des cookies maison tout chauds',
      feedback: {
        diagnosis: '<p>Il n’y a rien de plus réconfortant que des cookies tout juste sortis du four !</p>',
      },
    },
    {
      id: '2',
      content: 'Des mini-éclairs au chocolat',
      feedback: {
        diagnosis:
          '<p>Les éclairs, c’est un peu l’élégance à l’état pur. Légers, crémeux, et surtout irrésistibles.</p>',
      },
    },
    {
      id: '3',
      content: 'Un plateau de fruits frais et de fromage',
      feedback: {
        diagnosis: '<p>Parfait pour ceux qui préfèrent un goûter plus léger, mais tout aussi délicieux.</p>',
      },
    },
    {
      id: '4',
      content: 'Une part de gâteau marbré au chocolat et à la vanille',
      feedback: {
        diagnosis: '<p>Un gâteau moelleux et gourmand qui se marie parfaitement avec une tasse de thé ou de café.</p>',
      },
    },
  ];

  return { id: '0c397035-a940-441f-8936-050db7f997af', instruction, proposals, solution };
}
