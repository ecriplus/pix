import { render } from '@1024pix/ember-testing-library';
import { click, findAll } from '@ember/test-helpers';
import ModulixAudioElement from 'mon-pix/components/module/element/audio';
import { module, test } from 'qunit';

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

    //  when
    const screen = await render(<template><ModulixAudioElement @audio={{audioElement}} /></template>);

    // then
    await click(screen.getByRole('button', { name: 'Afficher la transcription' }));
    assert.ok(await screen.findByRole('dialog'));
    assert.ok(screen.getByText('transcription'));

    await click(screen.getByRole('button', { name: 'Fermer' }));
    await waitForDialogClose();

    assert.dom(screen.queryByRole('dialog')).doesNotExist();
  });
});
