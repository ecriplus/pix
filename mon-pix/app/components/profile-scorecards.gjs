import t from 'ember-intl/helpers/t';
import eq from 'ember-truth-helpers/helpers/eq';
import CompetenceCard from 'mon-pix/components/competence-card';
<template>
  <section class="profile-scorecards">
    <h2 class="sr-only">{{t "pages.profile.accessibility.user-skills"}}</h2>
    <ul class="profile-scorecards__areas">
      {{#each @areas as |area|}}
        <li>
          <h3 class="sr-only">{{area.title}}</h3>
          <ul class="profile-scorecards__competences">
            {{#each @scorecards as |scorecard|}}
              {{#if (eq area.code scorecard.area.code)}}
                <li>
                  <CompetenceCard @interactive={{@interactive}} @scorecard={{scorecard}} />
                </li>
              {{/if}}
            {{/each}}
          </ul>
        </li>
      {{/each}}
    </ul>
  </section>
</template>
