import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import pageTitle from 'ember-page-title/helpers/page-title';
import ListItems from 'pix-admin/components/networks/list-items';

<template>
  {{pageTitle "Réseaux"}}
  <header>
    <h1>Tous les réseaux</h1>
    <div class="page-actions">
      <PixButtonLink @route="authenticated.networks.new" @variant="secondary" @iconBefore="add">
        Nouveau réseau
      </PixButtonLink>
    </div>
  </header>

  <main class="page-body">
    <section class="page-section">
      <ListItems @networks={{@model}} />
    </section>
  </main>
</template>
