import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixRadioButton from '@1024pix/pix-ui/components/pix-radio-button';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import PixTextarea from '@1024pix/pix-ui/components/pix-textarea';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { eq, gt } from 'ember-truth-helpers';
import PixFieldset from 'pix-admin/components/ui/pix-fieldset';

export default class CombineCourseForm extends Component {
  @service pixToast;

  @tracked combinedCourseItems = [];
  @tracked itemId = null;
  @tracked itemType = 'campaign';
  @tracked name = '';
  @tracked illustration = '';
  @tracked description = '';
  @tracked organizationIds = null;
  @tracked creatorId = null;

  @action
  addItem(event) {
    event.preventDefault();
    if (this.itemType === 'campaign') {
      this.addCampaign();
    } else {
      this.addModule();
    }

    document.getElementsByName('itemType')[0].focus();
  }

  addCampaign() {
    this.combinedCourseItems = [
      ...this.combinedCourseItems,
      {
        type: 'campaignParticipations',
        value: Number(this.itemId),
      },
    ];
    this.itemId = null;
  }

  addModule() {
    this.combinedCourseItems = [
      ...this.combinedCourseItems,
      {
        type: 'passages',
        value: this.itemId,
      },
    ];
    this.itemId = null;
  }

  @action
  async downloadCSV() {
    try {
      const jsonParsed = JSON.stringify({
        name: this.name,
        description: this.description,
        illustration: this.illustration,
        combinedCourseContent: this.combinedCourseItems,
      });
      const exportedData = [
        ['Identifiant des organisations*', 'Identifiant du createur des campagnes*', 'Json configuration for quest*'],
        [this.organizationIds, this.creatorId, jsonParsed],
      ];

      const csvContent = exportedData
        .map((line) => line.map((data) => `"${data.replaceAll('"', '""').replaceAll('\\""', '\\"')}"`).join(';'))
        .join('\n');

      const exportLink = document.createElement('a');
      exportLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      exportLink.setAttribute('download', `${this.name}.csv`);
      exportLink.click();

      console.log(csvContent);
    } catch (e) {
      console.error(e);
    }
  }

  getItemType(item) {
    return item.type === 'campaignParticipations' ? 'campaign' : 'module';
  }

  getItemValue(item) {
    return item.value;
  }

  getItemColor(item) {
    return item.type === 'campaignParticipations' ? 'purple' : 'blue';
  }

  @action
  setData(key, e) {
    this[key] = e.target.value;
  }

  @action
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.setData('itemId', event);
      this.addItem(event);
    }
  }

  <template>
    <PixBlock @variant="admin" class="combined-course-page">
      <h1 class="combined-course-page__title">Créateur de parcours</h1>

      <form class="combined-course-page__form">
        <PixInput
          @id="organizationIds"
          @value={{this.organizationIds}}
          @requiredLabel="Champ obligatoire"
          {{on "change" (fn this.setData "organizationIds")}}
          class="combined-course-page__input"
        >
          <:label>
            liste des organisations
          </:label>
          <:subLabel>
            (ids séparés par des virgules)
          </:subLabel>
        </PixInput>

        <PixInput
          @id="creatorId"
          @value={{this.creatorId}}
          @requiredLabel="Champ obligatoire"
          {{on "change" (fn this.setData "creatorId")}}
          class="combined-course-page__input"
        >
          <:label>
            Identifiant du créateur
          </:label>
        </PixInput>

        <PixInput
          @id="name"
          @value={{this.name}}
          @requiredLabel="Champ obligatoire"
          {{on "change" (fn this.setData "name")}}
          class="combined-course-page__input"
        >
          <:label>
            Nom
          </:label>
        </PixInput>

        <PixInput
          @id="illustration"
          @value={{this.illustration}}
          @requiredLabel="Champ obligatoire"
          {{on "change" (fn this.setData "illustration")}}
          class="combined-course-page__input"
        >
          <:label>
            Illustration
          </:label>
        </PixInput>

        <PixTextarea
          @id="description"
          @value={{this.description}}
          @requiredLabel="Champ obligatoire"
          {{on "change" (fn this.setData "description")}}
          class="combined-course-page__input"
        >
          <:label>
            Description
          </:label>
        </PixTextarea>

        <PixFieldset>
          <:title>Choisissez le type d'élément à ajouter :</:title>
          <:content>
            <PixRadioButton
              name="itemType"
              @value="campaign"
              checked={{if (eq this.itemType "campaign") "checked"}}
              {{on "change" (fn this.setData "itemType")}}
            >
              <:label>Campagne</:label>
            </PixRadioButton>
            <PixRadioButton
              name="itemType"
              checked={{if (eq this.itemType "module") "checked"}}
              @value="module"
              {{on "change" (fn this.setData "itemType")}}
            >
              <:label>Module</:label>
            </PixRadioButton>
          </:content>
        </PixFieldset>

        <PixInput
          @id="itemId"
          @value={{this.itemId}}
          @requiredLabel="Champ obligatoire"
          {{on "change" (fn this.setData "itemId")}}
          {{on "keyup" this.handleKeyPress}}
          class="combined-course-page__input"
        >
          <:label>
            Identifiant
          </:label>
        </PixInput>

        <PixButton @triggerAction={{this.addItem}} class="combined-course-page__button">Ajouter un item</PixButton>
      </form>

      <hr class="combined-course-page__separator" />

      <h2 class="combined-course-page__title">Contenu du parcours tout court</h2>

      {{#if (gt this.combinedCourseItems.length 0)}}
        <ul class="combined-course-page__list">
          {{#each this.combinedCourseItems as |item|}}
            <li class="combined-course-page__list-item"><PixTag @color={{this.getItemColor item}}>
                {{this.getItemType item}}
                -
                {{this.getItemValue item}}
              </PixTag>
            </li>
          {{/each}}
        </ul>
      {{else}}
        <p>Votre parcours n'a aucun élément ajouté.</p>
      {{/if}}

      <PixButton class="combined-course-page__button" @triggerAction={{this.downloadCSV}} @variant="success">Télécharger
        le CSV</PixButton>
    </PixBlock>
  </template>
}
