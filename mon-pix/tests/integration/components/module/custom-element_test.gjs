import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModulixCustomElement from 'mon-pix/components/module/element/custom-element';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { waitForDialog } from '../../../helpers/wait-for';

module('Integration | Component | Module | Custom Element', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when isModulixIssueReportDisplayed FT is enabled', function () {
    test('should display report button', async function (assert) {
      const customElement = {
        id: 'id',
        title: 'mon-custom-test',
        instruction: 'Test POI quiz image',
        tagName: 'image-quiz',
        props: {
          name: 'Liste d‘applications',
          imageChoicesSize: 'icon',
          choices: [
            {
              name: 'Google',
              image: {
                width: 534,
                height: 544,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/Google.B1bcY5Go_1BynY8.svg',
              },
            },
            {
              name: 'LibreOffice Writer',
              image: {
                width: 205,
                height: 246,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/writer.3bR8N2DK_Z1iWuJ9.webp',
              },
            },
            {
              name: 'Explorateur',
              image: {
                width: 128,
                height: 128,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/windows-file-explorer.CnF8MYwI_23driA.webp',
              },
            },
            {
              name: 'Geogebra',
              image: {
                width: 640,
                height: 640,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/geogebra.CZH9VYqc_19v4nj.webp',
              },
            },
          ],
        },
      };
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });

      // when
      const screen = await render(<template><ModulixCustomElement @component={{customElement}} /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).exists();
    });

    module('when user clicks on report button', function () {
      test('should display issue-report modal with a form inside', async function (assert) {
        // given
        const customElement = {
          id: 'b0e9d79f-1727-4861-ac89-bd834473d62b',
          title: 'mon-custom-test',
          instruction: 'Test POI quiz image',
          tagName: 'image-quiz',
          props: {
            name: 'Liste d‘applications',
            imageChoicesSize: 'icon',
            choices: [
              {
                name: 'Google',
                image: {
                  width: 534,
                  height: 544,
                  loading: 'lazy',
                  decoding: 'async',
                  src: 'https://epreuves.pix.fr/_astro/Google.B1bcY5Go_1BynY8.svg',
                },
              },
              {
                name: 'LibreOffice Writer',
                image: {
                  width: 205,
                  height: 246,
                  loading: 'lazy',
                  decoding: 'async',
                  src: 'https://epreuves.pix.fr/_astro/writer.3bR8N2DK_Z1iWuJ9.webp',
                },
              },
              {
                name: 'Explorateur',
                image: {
                  width: 128,
                  height: 128,
                  loading: 'lazy',
                  decoding: 'async',
                  src: 'https://epreuves.pix.fr/_astro/windows-file-explorer.CnF8MYwI_23driA.webp',
                },
              },
              {
                name: 'Geogebra',
                image: {
                  width: 640,
                  height: 640,
                  loading: 'lazy',
                  decoding: 'async',
                  src: 'https://epreuves.pix.fr/_astro/geogebra.CZH9VYqc_19v4nj.webp',
                },
              },
            ],
          },
        };
        const featureToggles = this.owner.lookup('service:featureToggles');
        sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });

        // when
        const screen = await render(
          <template>
            <div id="modal-container"></div>
            <ModulixCustomElement @component={{customElement}} />
          </template>,
        );
        await click(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') }));
        await waitForDialog();

        // then
        assert.dom(screen.getByRole('dialog')).exists();
        assert
          .dom(screen.getByRole('heading', { name: t('pages.modulix.issue-report.modal.title'), level: 1 }))
          .exists();
      });
    });
  });

  module('when isModulixIssueReportDisplayed FT is disabled', function () {
    test('should not display report button', async function (assert) {
      // given
      const customElement = {
        id: 'b0e9d79f-1727-4861-ac89-bd834473d62b',
        title: 'mon-custom-test',
        instruction: 'Test POI quiz image',
        tagName: 'image-quiz',
        props: {
          name: 'Liste d‘applications',
          imageChoicesSize: 'icon',
          choices: [
            {
              name: 'Google',
              image: {
                width: 534,
                height: 544,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/Google.B1bcY5Go_1BynY8.svg',
              },
            },
            {
              name: 'LibreOffice Writer',
              image: {
                width: 205,
                height: 246,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/writer.3bR8N2DK_Z1iWuJ9.webp',
              },
            },
            {
              name: 'Explorateur',
              image: {
                width: 128,
                height: 128,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/windows-file-explorer.CnF8MYwI_23driA.webp',
              },
            },
            {
              name: 'Geogebra',
              image: {
                width: 640,
                height: 640,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/geogebra.CZH9VYqc_19v4nj.webp',
              },
            },
          ],
        },
      };
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: false });

      // when
      const screen = await render(<template><ModulixCustomElement @component={{customElement}} /></template>);

      // then
      assert.dom(screen.queryByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).doesNotExist();
    });
  });
});
