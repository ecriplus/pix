import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixTextarea from '@1024pix/pix-ui/components/pix-textarea';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

const LOCAL_STORAGE_KEY = 'QUEST_REQUIREMENT_SNIPPETS';

export default class QuestForm extends Component {
  @tracked name = '';
  @tracked rewardType = 'attestations';
  @tracked rewardId = '';
  //@tracked eligibilityRequirementsStr = 'all(one-of(OrgaAEFE,OrgaSCO),all(OrgaAEFE,OrgaSCO,MonCousin),OrgaAEFE)';
  @tracked eligibilityRequirementsStr = '';

  @service router;
  @service pixToast;

  get snippets() {
    const snippets = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ?? {
      objectRequirementsByLabel: {},
    };
    return Object.keys(snippets.objectRequirementsByLabel);
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  updateRewardType(event) {
    this.rewardType = event.target.value;
  }

  @action
  updateRewardId(event) {
    this.rewardId = event.target.value;
  }

  @action
  updateEligibilityRequirements(event) {
    this.eligibilityRequirementsStr = event.target.value;
  }

  @action
  appendToEligibilityRequirements(str) {
    this.eligibilityRequirementsStr += str;
  }

  @action
  async copyEligibilityRequirementsToClipboard() {
    try {
      const snippets = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ?? {
        objectRequirementsByLabel: {},
      };
      const eligibilityRequirements = this.popToRootToPip(
        this.eligibilityRequirementsStr,
        snippets.objectRequirementsByLabel,
      );
      const eligibilityRequirementsJSON = JSON.stringify([eligibilityRequirements]);

      console.log([eligibilityRequirements]);
      console.log(eligibilityRequirementsJSON);
      await navigator.clipboard.writeText(eligibilityRequirementsJSON);
      this.pixToast.sendSuccessNotification({
        message: 'Votre quête a été copié dans votre presse papier ou presque.',
      });
    } catch (error) {
      console.log(error);
      this.pixToast.sendErrorNotification({ message: 'Votre quête a une erreur quelque part.' });
    }
  }

  /*
      On parcourt la chaîne de caractères. Quand on tombe sur un mot qu'on "reconnaît" on fait une action.

      Fonction inspirée des algorithmes d'évaluation d'expression arithmétique, dans notre cas la notation dite "préfixe"
      On a l'habitude de lire les expressions arithmétiques dans une notation dite "infixe" :
      x + y ---> x et y sont des opérandes, et le jeton d'opération se trouve au milieu
      En notation préfixe, ça donne ceci :
      + x y ---> le jeton d'opération se trouve au début
      En programmation, cette notation est plus facile à traiter. Il existe notamment une technique connue s'appuyant
      sur l'utilisation de piles.
      Plus d'infos : https://zanotti.univ-tln.fr/ALGO/II/Polonaise.html
      On remarquera que l'expression construite pour les requirements d'éligibilité dans le formulaire ressemble beaucoup à
      une notation "préfixe" :
      ALL(ONE-OF(A,B),C) ---> Le jeton d'opération (all ou one-of) se trouve au début, et en arguments
      on trouve la liste des opérandes.
   */
  popToRootToPip(str, objectRequirementsByLabel) {
    // Dictionnaire des "mots" qui correspondent à des requirements feuilles
    // qu'on pourrait retrouver dans la formule
    const snippetNames = Object.keys(objectRequirementsByLabel);
    const composeStack = [];
    let currentWord = '';
    let latestCompletedCompose;
    for (const char of str) {
      currentWord += char;
      if (currentWord === ')') {
        // Le requirement compose en cours est fini
        // On le sort de la pile et on l'ajoute dans le requirement compose juste en dessous
        latestCompletedCompose = composeStack.pop();
        if (composeStack.length > 0) {
          composeStack.at(-1).data.push(latestCompletedCompose);
        }
        currentWord = '';
      } else if (currentWord === ',') {
        // à ignorer car on passe à l'opérande suivant
        currentWord = '';
      } else if (currentWord === 'all(') {
        // Initialiser un requirement compose "all" et ajouter en haut de la pile
        // Il devient le requirement compose en cours de traitement
        const composeAll = {
          requirement_type: 'compose',
          comparison: 'all',
          data: [],
        };
        composeStack.push(composeAll);
        currentWord = '';
      } else if (currentWord === 'one-of(') {
        // Initialiser un requirement compose "one-of" et ajouter en haut de la pile
        // Il devient le requirement compose en cours de traitement
        const composeOneOf = {
          requirement_type: 'compose',
          comparison: 'one-of',
          data: [],
        };
        composeStack.push(composeOneOf);
        currentWord = '';
      } else if (snippetNames.includes(currentWord)) {
        // Un opérande ! on l'ajoute au requirement compose en cours
        composeStack.at(-1).data.push(objectRequirementsByLabel[currentWord]);
        currentWord = '';
      }
    }
    return latestCompletedCompose;
  }

  <template>
    <PixBlock @variant="admin" class="quest-button-edition">
      <h1>Création de la quête</h1>
      <div class="quest-button-edition__form">
        <PixInput onchange={{this.updateName}} required={{true}}>
          <:label>Nom de la quête</:label>
        </PixInput>
        <PixInput onchange={{this.updateRewardType}} required={{true}}>
          <:label>Type de récompense</:label>
        </PixInput>
        <PixInput onchange={{this.updateRewardId}} required={{true}}>
          <:label>ID de récompense</:label>
        </PixInput>
      </div>

      <PixTextarea
        value={{this.eligibilityRequirementsStr}}
        {{on "change" this.updateEligibilityRequirements}}
        rows="15"
      >
        <:label>Mes requirements d'éligibilité</:label>
      </PixTextarea>
    </PixBlock>

    <PixBlock @variant="admin" class="quest-button-edition">
      <ul class="quest-button-edition__list">
        <li>
          <PixButton
            @size="small"
            @variant="secondary"
            @triggerAction={{fn this.appendToEligibilityRequirements "all("}}
          >
            all(
          </PixButton>
        </li>
        <li>
          <PixButton
            @size="small"
            @variant="secondary"
            @triggerAction={{fn this.appendToEligibilityRequirements "one-of("}}
          >
            one-of(
          </PixButton>
        </li>
        <li>
          <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.appendToEligibilityRequirements ")"}}>
            )
          </PixButton>
        </li>
        <li>
          <PixButton @size="small" @variant="secondary" @triggerAction={{fn this.appendToEligibilityRequirements ","}}>
            ,
          </PixButton>
        </li>
      </ul>
      <ul class="quest-button-edition__list">
        {{#each this.snippets as |snippetName|}}
          <li>
            <PixButton
              @size="small"
              @variant="secondary"
              @triggerAction={{fn this.appendToEligibilityRequirements snippetName}}
            >
              {{snippetName}}
            </PixButton>
          </li>
        {{/each}}
      </ul>
    </PixBlock>

    <div class="quest-button-edition__button">
      <PixButtonLink @route="authenticated.quest-new-or-edit-snippet" @size="small" @variant="primary">
        Ajouter un nouveau snippet de requirement
      </PixButtonLink>

      <PixButton @size="small" @variant="success" @triggerAction={{this.copyEligibilityRequirementsToClipboard}}>
        Mettre le json des requirements d'éligibilité dans le presse-papiers
      </PixButton>
    </div>
  </template>
}
