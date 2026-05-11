import Component from '@glimmer/component';
import { t } from 'ember-intl';

const MAX_VISIBLE_BADGES = 5;

export default class AcquiredBadgesCompact extends Component {
  get visibleBadges() {
    return this.args.acquiredBadges.slice(0, MAX_VISIBLE_BADGES);
  }

  get overflowCount() {
    return Math.max(0, this.args.acquiredBadges.length - MAX_VISIBLE_BADGES);
  }

  <template>
    <ul class="acquired-badges-compact" aria-label={{t "pages.skill-review.hero.acquired-badges-title"}}>
      {{#each this.visibleBadges as |badge|}}
        <li class="acquired-badges-compact__item">
          <img
            class="acquired-badges-compact__icon"
            src={{badge.imageUrl}}
            alt={{badge.altMessage}}
            title={{badge.title}}
          />
        </li>
      {{/each}}
      {{#if this.overflowCount}}
        <li class="acquired-badges-compact__overflow" aria-hidden="true">
          <span class="sr-only"> {{t "pages.skill-review.hero.hidden-badges" count=this.overflowCount}} </span>
          +{{this.overflowCount}}
        </li>
      {{/if}}
    </ul>
  </template>
}
