import Component from '@glimmer/component';

export default class ChallengeWrapper extends Component {
  //Si la propriété @type n'est pas renseignée, par défaut on considère que c'est une image !

  <template>
    <div class="challenge-wrapper">
      {{yield}}
    </div>
  </template>
}
