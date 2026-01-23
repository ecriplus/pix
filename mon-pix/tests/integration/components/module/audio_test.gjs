import { render } from '@1024pix/ember-testing-library';
// eslint-disable-next-line no-restricted-imports
import { click, find, findAll } from '@ember/test-helpers';
import ModulixAudioElement from 'mon-pix/components/module/element/audio';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { waitForDialogClose } from '../../../helpers/wait-for';

module('Integration | Component | Module | Audio', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display an audio', async function (assert) {
    // given
    const url = 'https://assets.pix.fr/modulix/placeholder-audio.mp3';

    const audioElement = {
      url,
      title: 'title',
      transcription: '',
    };

    //  when
    const screen = await render(<template><ModulixAudioElement @audio={{audioElement}} /></template>);

    // then
    assert.ok(screen);
    assert.strictEqual(findAll('.element-audio').length, 1);
    assert.ok(document.getElementsByClassName('pix-audio-player'));
  });

  test('should be able to open and close the modal for transcription', async function (assert) {
    // given
    const url = 'https://assets.pix.fr/modulix/placeholder-audio.mp3';

    const audioElement = {
      url,
      title: 'title',
      transcription: 'transcription',
    };

    const passageEventService = this.owner.lookup('service:passageEvents');

    const passageEventRecordStub = sinon.stub(passageEventService, 'record');

    const metricsService = this.owner.lookup('service:pix-metrics');
    const trackEventStub = sinon.stub(metricsService, 'trackEvent');

    //  when
    const screen = await render(<template><ModulixAudioElement @audio={{audioElement}} /></template>);

    // then
    await click(screen.getByRole('button', { name: 'Afficher la transcription' }));
    assert.ok(await screen.findByRole('dialog'));
    assert.ok(screen.getByText('transcription'));

    await click(screen.getByRole('button', { name: 'Fermer' }));
    await waitForDialogClose();

    assert.dom(screen.queryByRole('dialog')).doesNotExist();
    sinon.assert.calledWithExactly(passageEventRecordStub, {
      type: 'AUDIO_TRANSCRIPTION_OPENED',
      data: {
        elementId: audioElement.id,
      },
    });
    sinon.assert.calledWithExactly(trackEventStub, 'Clic sur le bouton transcription d’un audio', {
      category: 'Modulix',
      elementId: audioElement.id,
    });
  });

  test('should send a passage event when clicking on play', async function (assert) {
    // given
    const url = 'https://assets.pix.fr/modulix/placeholder-audio.mp3';

    const audioElement = {
      url,
      id: 'bc54e212-71d2-420b-8c73-bd5d8b729f9c',
      title: 'title',
      transcription: 'transcription',
    };

    const passageEventService = this.owner.lookup('service:passageEvents');

    const passageEventRecordStub = sinon.stub(passageEventService, 'record');

    //  when
    await render(<template><ModulixAudioElement @audio={{audioElement}} /></template>);
    const audio = find(`#${audioElement.id}`);

    const event = new Event('play');
    audio.dispatchEvent(event);

    // then
    sinon.assert.calledWithExactly(passageEventRecordStub, {
      type: 'AUDIO_PLAYED',
      data: {
        elementId: audioElement.id,
      },
    });
    assert.ok(true);
  });
});
