import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixStars from '@1024pix/pix-ui/components/pix-stars';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import t from 'ember-intl/helpers/t';

export default class Ended extends Component {
  <template>
    <PixBlock class="campaign-participation-overview-card" role="article">
      <div class="campaign-participation-overview-card__header">
        <PixTag class="campaign-participation-overview-card-header__tag" @color="grey-light">
          {{t "pages.campaign-participation-overview.card.tag.finished"}}
        </PixTag>
        <h2
          class="campaign-participation-overview-card-header__title"
          aria-label={{@model.organizationName}}
        >{{@model.organizationName}}</h2>
        <strong
          class="campaign-participation-overview-card-header__subtitle"
          aria-label={{@model.campaignTitle}}
        >{{@model.campaignTitle}}</strong>
        <time class="campaign-participation-overview-card-header__date" datetime="{{@model.sharedAt}}">
          {{t "pages.campaign-participation-overview.card.finished-at" date=(dayjsFormat @model.sharedAt "DD/MM/YYYY")}}
        </time>
      </div>
      <section class="campaign-participation-overview-card-content">
        <div class="campaign-participation-overview-card-content__content">
          {{#if this.hasStages}}
            <PixStars
              @count={{this.count}}
              @total={{this.total}}
              @alt={{t "pages.campaign-participation-overview.card.stages" count=this.count total=this.total}}
              @color="yellow"
            />
          {{else}}
            <p>
              {{t "pages.campaign-participation-overview.card.results" result=@model.masteryRate}}
            </p>
          {{/if}}
        </div>
        <PixButton
          class="campaign-participation-overview-card-content__action"
          @variant={{if @model.canRetry "primary" "secondary"}}
          @triggerAction={{this.onClick}}
        >
          {{#if @model.canRetry}}
            {{t "pages.campaign-participation-overview.card.retry"}}
          {{else}}
            {{t "pages.campaign-participation-overview.card.see-more"}}
          {{/if}}
        </PixButton>
      </section>
    </PixBlock>
  </template>
  @service router;
  @service pixMetrics;

  get hasStages() {
    return this.args.model.totalStagesCount > 0;
  }

  get count() {
    return this.args.model.validatedStagesCount - 1;
  }

  get total() {
    return this.args.model.totalStagesCount - 1;
  }

  @action
  onClick() {
    this.pixMetrics.trackEvent(`Voir le détail d'une participation partagée`, {
      disabled: true,
      category: 'Campaign participation',
      action: `Voir le détail d'une participation partagée`,
    });
    this.router.transitionTo('campaigns.entry-point', this.args.model.campaignCode);
  }
}
