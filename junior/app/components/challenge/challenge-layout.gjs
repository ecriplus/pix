import Component from '@glimmer/component';

export default class ChallengeLayout extends Component {
  get className() {
    return this.args.color ?? 'default';
  }

  <template>
    <div class="challenge-layout challenge-layout--{{this.className}}">
      <div class="container">
        {{yield}}
      </div>
    </div>
  </template>
}
