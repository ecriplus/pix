import dayjsDurationHumanize from 'ember-dayjs/helpers/dayjs-duration-humanize';
import { t } from 'ember-intl';

<template>
  <div class="tube-recommendation-tutorial__description">
    {{@tubeRecommendation.tubeDescription}}
  </div>
  <h4 class="tube-recommendation-tutorial__title">
    {{t "pages.campaign-review.sub-table.title" count=@tubeRecommendation.tutorials.length}}
  </h4>
  <ul>
    {{#each @tubeRecommendation.tutorials as |tutorial|}}
      <li>
        <a href={{tutorial.link}} class="link" target="_blank" rel="noopener noreferrer">{{tutorial.title}}</a>
        <span class="tube-recommendation-tutorial__details">
          <strong>·</strong>
          {{t "pages.campaign-review.sub-table.column.source.value" source=tutorial.source}}
          <strong>·</strong>
          <span class="tube-recommendation-tutorial__format">{{tutorial.format}}</span>
          <strong>·</strong>
          {{dayjsDurationHumanize tutorial.duration "seconds"}}
        </span>
      </li>
    {{/each}}
  </ul>
</template>
