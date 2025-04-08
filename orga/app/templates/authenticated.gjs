import NotificationContainer from '@1024pix/ember-cli-notifications/components/notification-container';
import PixAppLayout from '@1024pix/pix-ui/components/pix-app-layout';
import TopBanners from 'pix-orga/components/banner/top-banners';
import Footer from 'pix-orga/components/layout/footer';
import Sidebar from 'pix-orga/components/layout/sidebar';
<template>
  <PixAppLayout @variant="orga" class="app">
    <:navigation>

      <Sidebar @placesCount={{@model.available}} @onChangeOrganization={{@controller.onChangeOrganization}} />
    </:navigation>
    <:main>

      <main class="main-content__body page">
        <TopBanners />
        {{outlet}}
      </main>
    </:main>
    <:footer>
      <Footer />
    </:footer>
  </PixAppLayout>
  <NotificationContainer @position="bottom-right" />
</template>
