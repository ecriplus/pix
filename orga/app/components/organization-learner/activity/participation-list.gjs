import { t } from 'ember-intl';

import TableHeader from '../../table/header';
import ParticipationRow from './participation-row';

<template>
  <div class="panel">
    <table class="table content-text content-text--small participation-list__table">
      <thead>
        <tr>
          <TableHeader @size="wide">{{t
              "pages.organization-learner.activity.participation-list.table.column.campaign-name"
            }}</TableHeader>
          <TableHeader @size="medium" @align="left">{{t
              "pages.organization-learner.activity.participation-list.table.column.campaign-type"
            }}</TableHeader>
          <TableHeader @size="medium" @align="left">
            {{t "pages.organization-learner.activity.participation-list.table.column.created-at"}}
          </TableHeader>
          <TableHeader @size="medium" @align="left">{{t
              "pages.organization-learner.activity.participation-list.table.column.shared-at"
            }}</TableHeader>
          <TableHeader @size="medium" @align="left">{{t
              "pages.organization-learner.activity.participation-list.table.column.status"
            }}</TableHeader>
          <TableHeader @size="medium" @align="left">{{t
              "pages.organization-learner.activity.participation-list.table.column.participation-count"
            }}</TableHeader>
        </tr>
      </thead>
      <tbody>
        {{#each @participations as |participation|}}
          <ParticipationRow @participation={{participation}} />
        {{/each}}
      </tbody>
    </table>
  </div>
</template>
