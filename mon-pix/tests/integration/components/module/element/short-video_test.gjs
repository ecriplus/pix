import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import ModulixShortVideo from 'mon-pix/components/module/element/short-video';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | ShortVideo', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a video element with autoplay and loop attribute', async function (assert) {
    // when
    await render(<template><ModulixShortVideo /></template>);

    // then
    assert.dom('video').hasAttribute('autoplay');
    assert.dom('video').hasAttribute('loop');
    assert.dom('video').hasAttribute('muted');
  });

  test('it should display a video element with src attribute', async function (assert) {
    // given
    const element = {
      url: 'https://assets.pix.org/modules/placeholder-video.mp4',
    };

    // when
    await render(<template><ModulixShortVideo @element={{element}} /></template>);
    // then
    assert.dom('video').hasAttribute('src', 'https://assets.pix.org/modules/placeholder-video.mp4');
  });

  test('should be able to use the modal for transcription', async function (assert) {
    // given
    const url = 'https://assets.pix.org/modules/placeholder-video.mp4';

    const shortVideoId = 'id';
    const shortVideoElement = {
      id: shortVideoId,
      url,
      title: 'title',
      transcription: 'transcription',
    };

    const passageEventService = this.owner.lookup('service:passageEvents');
    const passageEventRecordStub = sinon.stub(passageEventService, 'record');

    const metricsService = this.owner.lookup('service:pix-metrics');
    const trackEventStub = sinon.stub(metricsService, 'trackEvent');

    //  when
    const screen = await render(<template><ModulixShortVideo @element={{shortVideoElement}} /></template>);

    // then
    await click(screen.getByRole('button', { name: 'Afficher la transcription' }));
    assert.ok(await screen.findByRole('dialog'));
    assert.ok(screen.getByText('transcription'));
    sinon.assert.calledWithExactly(passageEventRecordStub, {
      type: 'SHORT_VIDEO_TRANSCRIPTION_OPENED',
      data: {
        elementId: shortVideoElement.id,
      },
    });
    sinon.assert.calledWithExactly(trackEventStub, 'Clic sur le bouton transcription d’une vidéo courte', {
      category: 'Modulix',
      elementId: shortVideoId,
    });
  });
});
