import { t } from 'ember-intl';
import AnalysisHeader from 'pix-orga/components/analysis/analysis-header';

import EmptyState from '../../../../components/ui/empty-state';

<template>
  {{#if @model.isAnalysisAvailable}}
    <AnalysisHeader @model={{@model}} />
    {{outlet}}
  {{else}}
    <EmptyState @infoText={{t "pages.assessment-individual-results.table.empty"}} />
  {{/if}}
</template>
