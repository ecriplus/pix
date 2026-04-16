import { t } from 'ember-intl';
import pageTitle from 'ember-page-title/helpers/page-title';
import CourseCard from 'pix-orga/components/courses/course-card';
import PageTitle from 'pix-orga/components/ui/page-title';

<template>
  {{pageTitle (t "navigation.main.catalogue")}}
  <PageTitle>
    <:title>
      {{t "pages.catalogue.title"}}
    </:title>
  </PageTitle>
  <div class="catalogue">
    {{#each @model as |course|}}
      <CourseCard @course={{course}} />
    {{/each}}
  </div>
</template>
