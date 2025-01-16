import PixInput from '@1024pix/pix-ui/components/pix-input';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import ListItem from './item';

export default class AutonomousCoursesList extends Component {
  @tracked items;

  get filteredItems() {
    return this.items || this.args.items;
  }

  @action
  triggerFiltering(key, event) {
    const normalizeText = (text) =>
      text
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const valueToSearch = normalizeText(event.target.value);

    this.items = this.args.items.filter((item) => !valueToSearch || normalizeText(item[key]).includes(valueToSearch));
  }

  <template>
    <div class="content-text content-text--small">
      <div class="table-admin">
        <table>
          <caption class="screen-reader-only">{{t "components.autonomous-courses.list.title"}}</caption>
          <thead>
            <tr>
              <th scope="col" class="table__column table__column--id">{{t
                  "components.autonomous-courses.list.headers.id"
                }}</th>
              <th scope="col">{{t "components.autonomous-courses.list.headers.name"}}</th>
              <th scope="col" class="table__column table__medium">{{t
                  "components.autonomous-courses.list.headers.createdAt"
                }}</th>
              <th scope="col" class="table__column table__medium">{{t
                  "components.autonomous-courses.list.headers.status"
                }}</th>
            </tr>
            <tr>
              <td>
                <PixInput type="text" oninput={{fn this.triggerFiltering "id"}} placeholder="Filtrer par ID" />
              </td>
              <td>
                <PixInput type="text" oninput={{fn this.triggerFiltering "name"}} placeholder="Filtrer par nom" />
              </td>
              <td></td>
              <td></td>
            </tr>
          </thead>

          {{#if this.filteredItems}}
            <tbody>
              {{#each this.filteredItems as |autonomousCourseListItem|}}
                <ListItem @item={{autonomousCourseListItem}} />
              {{/each}}
            </tbody>
          {{/if}}
        </table>

        {{#unless @items}}
          <div class="table__empty">{{t "components.autonomous-courses.list.no-result"}}</div>
        {{/unless}}
      </div>
    </div>
  </template>
}
