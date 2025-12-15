import { t } from 'ember-intl';
import CombinedCourseBlueprintListSummaryItems from 'pix-admin/components/combined-course-blueprints/list-summary-items';

<template>
  <div class="page">
    <header>
      <h1>{{t "components.combined-course-blueprints.list.title"}}</h1>
    </header>

    <main class="page-body">
      <section>
        <CombinedCourseBlueprintListSummaryItems @summaries={{@model}} />
      </section>
    </main>
  </div>
</template>
