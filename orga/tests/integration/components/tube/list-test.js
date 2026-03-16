import { clickByName, render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | tube:list', function (hooks) {
  setupIntlRenderingTest(hooks);
  let frameworks;
  const MOCK_TODAY = '2020-08-05-1152';
  let dayjs;

  hooks.beforeEach(function () {
    const tubesPix = [
      {
        id: 'tubeId1Pix',
        practicalTitle: 'Titre 1 Tube Pix',
        practicalDescription: 'Description 1',
      },
      {
        id: 'tubeId2Pix',
        practicalTitle: 'Titre 2 Tube Pix',
        practicalDescription: 'Description 2',
      },
    ];
    const thematicsPix = [
      {
        id: 'thematicId',
        name: 'thematic1',
        tubes: tubesPix,
        get sortedTubes() {
          return tubesPix;
        },
      },
    ];
    const competencesPix = [
      {
        thematics: thematicsPix,
        get sortedThematics() {
          return thematicsPix;
        },
      },
    ];
    const areasPix = [
      {
        title: 'Titre domaine Pix',
        code: 1,
        competences: competencesPix,
        get sortedCompetences() {
          return competencesPix;
        },
      },
    ];

    const tubesEdu = [
      {
        id: 'tubeIdEdu1',
        practicalTitle: 'Titre 1 Tube Edu',
        practicalDescription: 'Description 1',
      },
    ];
    const thematicsEdu = [
      {
        id: 'thematicId',
        name: 'thematic1',
        tubes: tubesEdu,
        get sortedTubes() {
          return tubesEdu;
        },
      },
    ];
    const competencesEdu = [
      {
        thematics: thematicsEdu,
        get sortedThematics() {
          return thematicsEdu;
        },
      },
    ];
    const areasEdu = [
      {
        title: 'Titre domaine Edu',
        code: 1,
        competences: competencesEdu,
        get sortedCompetences() {
          return competencesEdu;
        },
      },
    ];

    frameworks = [
      {
        id: 'fmkId1',
        name: 'Pix',
        areas: areasPix,
        get sortedAreas() {
          return areasPix;
        },
      },
      {
        id: 'fmkId2',
        name: 'Edu+',
        areas: areasEdu,
        get sortedAreas() {
          return areasEdu;
        },
      },
    ];
    dayjs = this.owner.lookup('service:dayjs');
    sinon.stub(dayjs.self.prototype, 'format').returns(MOCK_TODAY);
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('it should display frameworks title', async function (assert) {
    // given
    this.set('frameworks', frameworks);

    // when
    const screen = await render(hbs`<Tube::list @frameworks={{this.frameworks}} />`);
    assert.ok(screen.getByRole('heading', { level: 2, name: 'Pix' }));
    assert.ok(screen.getByRole('heading', { level: 2, name: 'Edu+' }));
  });

  test('it should display a list of tubes', async function (assert) {
    // given
    this.set('frameworks', frameworks);

    // when
    const screen = await render(hbs`<Tube::list @frameworks={{this.frameworks}} />`);
    await clickByName('1 · Titre domaine Pix');
    // then
    assert.dom(screen.getByLabelText('Titre 1 Tube Pix : Description 1')).exists();
    assert.dom(screen.getByLabelText('Titre 2 Tube Pix : Description 2')).exists();
  });

  test('it should disable the download button if not tube is selected', async function (assert) {
    // given
    this.set('frameworks', frameworks);

    // when
    const screen = await render(hbs`<Tube::list @frameworks={{this.frameworks}} />`);

    // then
    assert
      .dom(screen.getByRole('button', { name: 'Télécharger la sélection des sujets (JSON, 0.00ko)', hidden: true }))
      .hasAttribute('aria-disabled', 'true');
  });

  test('it should enable the download button if a tube is selected', async function (assert) {
    const expectedAttr = `selection-sujets-mon orga-${MOCK_TODAY}.json`;
    this.set('frameworks', frameworks);
    this.set('organization', { name: 'mon orga' });

    // when
    const screen = await render(
      hbs`<Tube::list @frameworks={{this.frameworks}} @organization={{this.organization}} />`,
    );

    await clickByName('1 · Titre domaine Pix');
    await clickByName('Titre 1 Tube Pix : Description 1');

    // then
    assert
      .dom(screen.getByText('Télécharger la sélection des sujets (1) (JSON, 0.04ko)'))
      .doesNotHaveClass('pix-button--disabled');

    assert
      .dom(screen.getByText('Télécharger la sélection des sujets (1) (JSON, 0.04ko)'))
      .hasAttribute('download', expectedAttr);
  });

  test('it should track the download event when the download button is clicked', async function (assert) {
    // given
    sinon.stub(URL, 'createObjectURL').returns('blob:fake-url');
    sinon.stub(URL, 'revokeObjectURL');

    this.set('frameworks', frameworks);
    this.set('organization', { name: 'mon orga' });
    const pixMetrics = this.owner.lookup('service:pix-metrics');
    const trackEventStub = sinon.stub(pixMetrics, 'trackEvent');

    await render(hbs`<Tube::list @frameworks={{this.frameworks}} @organization={{this.organization}} />`);

    await clickByName('1 · Titre domaine Pix');
    await clickByName('Titre 1 Tube Pix : Description 1');

    // when
    await clickByName('Télécharger la sélection des sujets (1) (JSON, 0.04ko)');

    // then
    assert.ok(trackEventStub.calledOnceWith('tubesSelectionDownloadJsonClick'));
  });

  test('Enable the download button if a thematic is selected', async function (assert) {
    // given
    this.set('frameworks', frameworks);

    // when
    await render(hbs`<Tube::list @frameworks={{this.frameworks}} />`);

    await clickByName('1 · Titre domaine Pix');
    await clickByName('thematic1');

    // then
    assert.dom('.download-file__button').doesNotHaveClass('pix-button--disabled');
  });

  test('Should check all tubes corresponding to the thematics if a thematic is selected', async function (assert) {
    // given
    this.set('frameworks', frameworks);

    // when
    const screen = await render(hbs`<Tube::list @frameworks={{this.frameworks}} />`);

    await clickByName('1 · Titre domaine Pix');
    await clickByName('thematic1');

    // then
    assert.dom(screen.getByLabelText('Titre 1 Tube Pix : Description 1')).isChecked();
    assert.dom(screen.getByLabelText('Titre 2 Tube Pix : Description 2')).isChecked();
  });

  test('Should check the thematics if all corresponding tubes are selected', async function (assert) {
    // given
    this.set('frameworks', frameworks);

    // when
    const screen = await render(hbs`<Tube::list @frameworks={{this.frameworks}} />`);

    await clickByName('1 · Titre domaine Pix');
    await clickByName('Titre 1 Tube Pix : Description 1');
    await clickByName('Titre 2 Tube Pix : Description 2');

    // then
    assert.dom(screen.getByLabelText('thematic1')).isChecked();
  });
});
