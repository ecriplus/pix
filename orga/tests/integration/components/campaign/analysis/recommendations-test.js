import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Campaign::Analysis::Recommendations', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;
  let screen;

  module('when the analysis is displayed', function () {
    module('common case', function (hooks) {
      hooks.beforeEach(async function () {
        store = this.owner.lookup('service:store');

        const campaignTubeRecommendation_1 = store.createRecord('campaign-tube-recommendation', {
          id: '1_recTubeA',
          tubeId: 'recTubeA',
          competenceId: 'recCompA',
          competenceName: 'Competence A',
          tubePracticalTitle: 'Tube A',
          areaColor: 'jaffa',
          averageScore: 10,
        });

        const campaignTubeRecommendation_2 = store.createRecord('campaign-tube-recommendation', {
          id: '1_recTubeB',
          tubeId: 'recTubeB',
          competenceId: 'recCompB',
          competenceName: 'Competence B',
          tubePracticalTitle: 'Tube B',
          areaColor: 'emerald',
          averageScore: 30,
        });

        this.campaignTubeRecommendations = [campaignTubeRecommendation_1, campaignTubeRecommendation_2];

        screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.campaignTubeRecommendations}}
  @displayAnalysis={{true}}
/>`);
      });

      test('it should display the tube analysis list of the campaign', async function (assert) {
        const subjects = screen.getAllByRole('row');
        assert.strictEqual(subjects.length, 3);
        assert.dom(subjects[1]).containsText('Tube A');
      });

      test('it should display tube details', async function (assert) {
        const firstTube = screen.getAllByRole('row')[1];
        assert.dom(firstTube).containsText('Tube A');
        assert.dom(firstTube).containsText('Competence A');
      });

      test('it should order by recommendation desc by default', async function (assert) {
        assert.dom(screen.getAllByRole('row')[1]).containsText('Tube A');
      });

      test('it should order by recommendation asc', async function (assert) {
        await click(
          screen.getByRole('button', {
            name: t('pages.campaign-review.table.analysis.column.relevance.ariaLabelDefaultSort'),
          }),
        );

        assert.dom(screen.getAllByRole('row')[1]).containsText('Tube B');
      });

      test('it should order by recommendation desc', async function (assert) {
        await click(
          screen.getByRole('button', {
            name: t('pages.campaign-review.table.analysis.column.relevance.ariaLabelDefaultSort'),
          }),
        );
        await click(
          screen.getByRole('button', {
            name: t('pages.campaign-review.table.analysis.column.relevance.ariaLabelSortUp'),
          }),
        );

        assert.dom(screen.getAllByRole('row')[1]).containsText('Tube A');
      });

      test('it should have a caption to describe the table', async function (assert) {
        assert.ok(screen.getByRole('table', { name: t('pages.campaign-review.table.analysis.caption') }));
      });
    });

    module('display tutorial', function (hooks) {
      let tutorial1, tutorial2;
      hooks.beforeEach(function () {
        store = this.owner.lookup('service:store');

        tutorial1 = store.createRecord('tutorial', {
          title: 'tutorial1',
          link: 'http://link.to.tuto.1',
          format: 'Vidéo',
          source: 'Youtube',
          duration: 600,
        });

        tutorial2 = store.createRecord('tutorial', {
          title: 'tutorial2',
          link: 'http://link.to.tuto.2',
        });

        this.tubeRecommendation = [
          store.createRecord('campaign-tube-recommendation', {
            id: '1_recTubeA',
            tubeId: 'recTubeA',
            competenceId: 'recCompA',
            competenceName: 'Competence A',
            tubePracticalTitle: 'Tube A',
            tubeDescription: 'Tube Desc A',
            areaColor: 'jaffa',
          }),
        ];
      });

      test('it should display tube details', async function (assert) {
        // when
        const screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.tubeRecommendation}}
  @displayAnalysis={{true}}
/>`);

        // then
        const firstTube = screen.getAllByRole('row')[1];
        assert.dom(firstTube).containsText('Tube A');
        assert.dom(firstTube).containsText('Competence A');
      });

      test('it should expand and display one tutorial in the list', async function (assert) {
        // given
        this.tubeRecommendation[0].tutorials = [tutorial1];

        const screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.tubeRecommendation}}
  @displayAnalysis={{true}}
/>`);

        // when
        await click(screen.getByLabelText(t('pages.campaign-review.table.analysis.column.tutorial.aria-label')));

        // then
        assert.ok(
          screen.getByRole('heading', { name: t('pages.campaign-review.sub-table.title', { count: 1 }), level: 4 }),
        );

        assert.strictEqual(screen.getAllByRole('listitem').length, 1);
        assert.ok(screen.getByRole('link', { name: 'tutorial1' }));
        assert.ok(screen.getByText('Vidéo'));
        assert.ok(screen.getByText(/10 minutes/));
        assert.ok(screen.getByText(/Par Youtube/));
        assert.ok(
          screen.getByRole('button', { name: 'Afficher la liste des tutos' }).hasAttribute('aria-expanded', 'true'),
        );
        assert.ok(screen.getByText('Tube Desc A'));
      });

      test('it should hide element to screen reader', async function (assert) {
        // given
        this.tubeRecommendation[0].tutorials = [tutorial1];

        const screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.tubeRecommendation}}
  @displayAnalysis={{true}}
/>`);

        // then
        assert.notOk(
          screen.queryByRole('heading', { name: t('pages.campaign-review.sub-table.title', { count: 1 }), level: 4 }),
        );
        assert.notOk(screen.queryByRole('link', { name: 'tutorial1' }));
        assert.notOk(screen.queryByText('Tube Desc A'));
        assert.ok(
          screen.getByRole('button', { name: 'Afficher la liste des tutos' }).hasAttribute('aria-expanded', 'false'),
        );
      });

      test('it should expand and display 2 tutorials in the list', async function (assert) {
        // given
        this.tubeRecommendation[0].tutorials = [tutorial1, tutorial2];

        const screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.tubeRecommendation}}
  @displayAnalysis={{true}}
/>`);

        // when
        await click(screen.getByLabelText(t('pages.campaign-review.table.analysis.column.tutorial.aria-label')));

        // then
        assert.strictEqual(screen.getAllByRole('listitem').length, 2);
      });

      module('Testing the number of tutorials', () => {
        test('it should display "1 tuto" when there is only one tutorial', async function (assert) {
          // given
          this.tubeRecommendation[0].tutorials = [tutorial1];

          //when
          const screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.tubeRecommendation}}
  @displayAnalysis={{true}}
/>`);

          // then
          assert.ok(screen.getByText('1 tuto'));
        });

        test('it should display "2 tutos" when there are two tutorials', async function (assert) {
          // given
          this.tubeRecommendation[0].tutorials = [tutorial1, tutorial2];

          //when
          const screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.tubeRecommendation}}
  @displayAnalysis={{true}}
/>`);

          // then
          assert.ok(screen.getByText('2 tutos'));
        });
      });
    });
  });

  module('when the analysis is not displayed', function () {
    test('it displays pending results', async function (assert) {
      this.campaignTubeRecommendations = [];

      const screen = await render(hbs`<Campaign::Analysis::Recommendations
  @campaignTubeRecommendations={{this.campaignTubeRecommendations}}
  @displayAnalysis={{false}}
/>`);
      assert.ok(screen.getByText('En attente de résultats'));
    });
  });
});
