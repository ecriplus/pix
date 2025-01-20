import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import ParticipationRow from './participation-row';

export default class ParticipationsSection extends Component {
  @service accessControl;

  <template>
    <section class="page-section">
      <header>
        <h2 class="participations-section__title">Liste des participations</h2>
      </header>
      <p class="participations-section__subtitle">
        Attention toute modification sur une participation nécessite un accord écrit du prescripteur.
      </p>
      <div class="content-text content-text--small">
        <div class="table-admin">
          <table>
            <thead>
              <tr>
                <th>Prescrit lié</th>
                <th>Compte lié</th>
                {{#if @externalIdLabel}}
                  <th>{{@externalIdLabel}}</th>
                {{/if}}
                <th>Date de début</th>
                <th>Statut</th>
                <th>Date d'envoi</th>
                <th class="table__column--medium">Supprimée le</th>
                {{#if this.accessControl.hasAccessToOrganizationActionsScope}}
                  {{#if @externalIdLabel}}
                    <th class="table__column">Actions</th>
                  {{/if}}
                {{/if}}
              </tr>
            </thead>

            {{#if @participations}}
              <tbody>
                {{#each @participations as |participation|}}
                  <tr aria-label="participation">
                    <ParticipationRow
                      @participation={{participation}}
                      @externalIdLabel={{@externalIdLabel}}
                      @updateParticipantExternalId={{@updateParticipantExternalId}}
                    />
                  </tr>
                {{/each}}
              </tbody>
            {{/if}}
          </table>

          {{#unless @participations}}
            <div class="table__empty">Aucune participation</div>
          {{/unless}}
        </div>
        {{#if @participations}}
          <PixPagination @pagination={{@participations.meta}} />
        {{/if}}
      </div>
    </section>
  </template>
}
