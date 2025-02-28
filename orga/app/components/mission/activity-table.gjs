import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { t } from 'ember-intl';

import getService from '../../helpers/get-service.js';
import Header from '../table/header';
function statusColor(status) {
  return {
    'not-started': 'tertiary',
    completed: 'success',
    started: 'secondary',
  }[status];
}

<template>
  toto
  {{#if @missionLearners}}
    <div class="panel">
      <table class="table content-text content-text--small participation-list__table mission-table">
        <caption class="screen-reader-only">{{t
            "pages.missions.mission.table.activities.caption"
            missionName=@mission.name
          }}</caption>
        <thead>
          <tr>
            <Header scope="col">{{t "pages.missions.mission.table.activities.headers.first-name"}}</Header>
            <Header scope="col">{{t "pages.missions.mission.table.activities.headers.last-name"}}</Header>
            <Header scope="col">{{t "pages.missions.mission.table.activities.headers.division"}}</Header>
            <Header scope="col">{{t "pages.missions.mission.table.activities.headers.status"}}</Header>
          </tr>
        </thead>
        <tbody>

          {{#each @missionLearners as |missionLearner|}}
            <tr aria-label={{t "pages.missions.mission.table.activities.aria-label"}}>
              <td>
                {{missionLearner.firstName}}
              </td>
              <td>
                {{missionLearner.lastName}}
              </td>
              <td>
                {{missionLearner.division}}
              </td>
              <td>
                <PixTag @color={{statusColor missionLearner.missionStatus}}>{{t
                    missionLearner.displayableStatus
                  }}</PixTag>
              </td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{#let (getService "service:intl") as |intl|}}
      <PixPagination @pagination={{@missionLearners.meta}} @locale={{intl.primaryLocale}} />
    {{/let}}
  {{else}}
    <div class="table__empty content-text">
      {{t "pages.missions.mission.table.activities.no-data"}}
    </div>
  {{/if}}
</template>
