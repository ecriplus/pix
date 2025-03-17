import { t } from 'ember-intl';

import MembershipItem from './membership-item';

<template>
  <section class="page-section">

    <header class="page-section__header">
      <h2 class="page-section__title">Membres</h2>
    </header>

    <div class="content-text content-text--small">
      <div class="table-admin">
        <table>
          <thead>
            <tr>
              <th class="table__column table__column--id">ID Utilisateur</th>
              <th class="table__column">Prénom</th>
              <th class="table__column">Nom</th>
              <th class="table__column table__column--wide">Adresse e-mail</th>
              <th class="table__column table__column--medium">Rôle</th>
              <th class="table__column">Dernier accès</th>
              <th class="table__column">Date de rattachement</th>
              <th class="table__column">Actions</th>
            </tr>
          </thead>

          {{#if @certificationCenterMemberships}}
            <tbody>
              {{#each @certificationCenterMemberships as |certificationCenterMembership|}}
                <MembershipItem
                  @certificationCenterMembership={{certificationCenterMembership}}
                  @disableCertificationCenterMembership={{@disableCertificationCenterMembership}}
                  @onCertificationCenterMembershipRoleChange={{@onCertificationCenterMembershipRoleChange}}
                />
              {{/each}}
            </tbody>
          {{/if}}
        </table>

        {{#unless @certificationCenterMemberships}}
          <div class="table__empty">{{t "common.tables.empty-result"}}</div>
        {{/unless}}
      </div>
    </div>
  </section>
</template>
