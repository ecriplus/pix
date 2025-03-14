import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';

const LOCAL_STORAGE_KEY = 'QUEST_REQUIREMENT_SNIPPETS';

export default class QuestForm extends Component {
  @tracked questName = '';
  @tracked questRewardType = '';
  @tracked questRewardId = '';
  @tracked questEligibilityRequirementsStr = 'all(one-of(all(MonCousin,OrgaSCO),OrgaAEFE),all(OrgaAEFE,one-of(MonCousin,OrgaAEFE)),one-of(OrgaSCO,all(MonCousin,OrgaSCO)))';
  @service router;

  constructor() {
    super(...arguments);
    console.log('constructor questform');
  }

  get snippets() {
    const { objectRequirementsByLabel } = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ?? { objectRequirementsByLabel: {} };
    return Object.keys(objectRequirementsByLabel);
  }

  @action
  onQuestNameChanged(event) {
    this.questName = event.target.value;
  }

  @action
  onQuestRewardTypeChanged(event) {
    this.questRewardType = event.target.value;
  }

  @action
  onQuestRewardIdChanged(event) {
    this.questRewardId = event.target.value;
  }

  @action
  onQuestEligibilityRequirementsChanged(event) {
    this.questEligibilityRequirementsStr = event.target.value;
  }

  @action
  onSubmitClicked(event) {
    event.preventDefault();
  }

  @action
  onAddSnippetInEligibilityRequirements(snippetName) {
    const stock = this.questEligibilityRequirementsStr;
    this.questEligibilityRequirementsStr = null
    this.questEligibilityRequirementsStr = stock + snippetName;
  }

  @action
  eligibilityRequirementJSONinClipboard() {
    const { objectRequirementsByLabel } = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ?? { objectRequirementsByLabel: {} };
    const obj = this.popToRootToPip(this.questEligibilityRequirementsStr, objectRequirementsByLabel);
    console.log([obj]);
    console.log(JSON.stringify([obj]));
  }

  recursiveToJson(str, objectRequirementsByLabel) {
    const regexAll = /^all\((.*)\)$/;
    const regexOneOf = /^one-of\((.*)\)$/;
    const regexOneOf2 = /^((one-of\((\w*,?)*\)))/;
    const regexAll2 = /^((all\((\w*,?)*\)))/;
    const execAll = regexAll.exec(str);
    const execOneOf = regexOneOf.exec(str);
    if(execAll?.length > 0) {
      const indexOfFirstComma = execAll[1].indexOf(',');
      const before = execAll[1].slice(0, indexOfFirstComma);
      const after = execAll[1].slice(indexOfFirstComma+1, execAll[1].length);
      console.log('all');
      console.log(before);
      console.log(after);
      const data = [before, after].map((member) => this.recursiveToJson(member, objectRequirementsByLabel));
      return {
        requirement_type: 'compose',
        comparison: 'all',
        data,
      };
    }
    else if(execOneOf?.length > 0) {
      const indexOfFirstComma = execOneOf[1].indexOf(',');
      const before = execOneOf[1].slice(0, indexOfFirstComma);
      const after = execOneOf[1].slice(indexOfFirstComma+1, execOneOf[1].length);
      console.log('oneof');
      console.log(before);
      console.log(after);
      const data = [before, after].map((member) => this.recursiveToJson(member, objectRequirementsByLabel));
      return {
        requirement_type: 'compose',
        comparison: 'one-of',
        data,
      };
    } else {
      return objectRequirementsByLabel[str];
    }
  }

  popToRootToPip(str, objectRequirementsByLabel) {
    const possibleWordsForSnippets = Object.keys(objectRequirementsByLabel);
    const composeStack = [];
    let currentWord = '';
    let root;
    for(const char of str) {
      currentWord += char;
      if(currentWord === ')') {
        root = composeStack.pop();
        currentWord = '';
      } else if(currentWord === ',') {
        currentWord = '';
      } else if(currentWord === 'all(') {
        const compose = {
          requirement_type: 'compose',
          comparison: 'all',
          data: [],
        };
        if(composeStack.length > 0) {
          composeStack.at(-1).data.push(compose);
        }
        composeStack.push(compose);
        currentWord = '';
      } else if(currentWord === 'one-of(') {
        const compose = {
          requirement_type: 'compose',
          comparison: 'one-of',
          data: [],
        };
        if(composeStack.length > 0) {
          composeStack.at(-1).data.push(compose);
        }
        composeStack.push(compose);
        currentWord = '';
      } else if(possibleWordsForSnippets.includes(currentWord)) {
        composeStack.at(-1).data.push(objectRequirementsByLabel[currentWord]);
        currentWord = '';
      }
    }
    return root;
  }

  <template>
    <PixInput
      @id="questName"
      onchange={{this.onQuestNameChanged}}
      required={{true}}
    >
      <:label>Nom de la quête</:label>
    </PixInput>
    <PixInput
      @id="rewardType"
      onchange={{this.onQuestRewardTypeChanged}}
      required={{true}}
    >
      <:label>Type de récompense</:label>
    </PixInput>
    <PixInput
      @id="rewardId"
      onchange={{this.onQuestRewardIdChanged}}
      required={{true}}
    >
      <:label>ID de récompense</:label>
    </PixInput>
    <PixButtonLink
      @route="authenticated.poc-quest-new-or-edit-snippet"
      @size="small"
      @variant="primary"
    >
      Ajouter un nouveau snippet de requirement
    </PixButtonLink>
    <textarea {{on "keyup" this.onQuestEligibilityRequirementsChanged}} value={{this.questEligibilityRequirementsStr}}></textarea>
    <ul>
      <li>
        <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.onAddSnippetInEligibilityRequirements "all"}}>
          all
        </PixButton>
      </li>
      <li>
        <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.onAddSnippetInEligibilityRequirements "one-of"}}>
          one-of
        </PixButton>
      </li>
      <li>
        <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.onAddSnippetInEligibilityRequirements "("}}>
          (
        </PixButton>
      </li>
      <li>
        <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.onAddSnippetInEligibilityRequirements ")"}}>
          )
        </PixButton>
      </li>
      <li>
        <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.onAddSnippetInEligibilityRequirements ","}}>
          ,
        </PixButton>
      </li>
      {{#each this.snippets as |snippetName|}}
        <li>
          <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.onAddSnippetInEligibilityRequirements snippetName}}>
            {{snippetName}}
          </PixButton>
        </li>
      {{/each}}
    </ul>
    <PixButton @size="small" @variant="secondary" @triggerAction={{this.eligibilityRequirementJSONinClipboard}}>
      Mettre le json d'eligibility dans le presse papiers
    </PixButton>
  </template>
}
