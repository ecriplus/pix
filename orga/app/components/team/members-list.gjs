import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import TableHeader from '../table/header';
import MembersListItem from './members-list-item';

export default class MembersList extends Component {
  @service currentUser;
  @service intl;

  get currentLocale() {
    return this.intl.primaryLocale;
  }

  get displayManagingColumn() {
    return this.currentUser.isAdminInOrganization;
  }

  get isMultipleAdminsAvailable() {
    return this.args.members?.filter((member) => member.isAdmin).length > 1;
  }

  <template>
    <div class="panel">
      <div class="table content-text content-text--small">
        <table>
          <thead>
            <tr>
              <TableHeader @size="wide">{{t "pages.team-members.table.column.last-name"}}</TableHeader>
              <TableHeader @size="wide">{{t "pages.team-members.table.column.first-name"}}</TableHeader>
              <TableHeader @size="wide">{{t
                  "pages.team-members.table.column.organization-membership-role"
                }}</TableHeader>
              {{#if this.displayManagingColumn}}
                <TableHeader @size="medium" class="hide-on-mobile">
                  <span>{{t "common.actions.global"}}</span>
                </TableHeader>
              {{/if}}
            </tr>
          </thead>
          {{#if @members}}
            <tbody>
              {{#each @members as |membership|}}
                <MembersListItem
                  @membership={{membership}}
                  @isMultipleAdminsAvailable={{this.isMultipleAdminsAvailable}}
                  @onRemoveMember={{@onRemoveMember}}
                  @onLeaveOrganization={{@onLeaveOrganization}}
                />
              {{/each}}
            </tbody>
          {{/if}}
        </table>

        {{#unless @members}}
          <div class="table__empty content-text">{{t "pages.team-members.table.empty"}}</div>
        {{/unless}}
      </div>
    </div>

    {{#if @members}}
      <PixPagination @pagination={{@members.meta}} @locale={{this.currentLocale}} />
    {{/if}}
  </template>
}
