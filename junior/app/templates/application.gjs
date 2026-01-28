import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Communication from 'junior/components/banner/communication';
import DeviceWarningModal from 'junior/components/device-warning-modal';
<template>
  {{pageTitle (t "pages.pix-junior")}}
  <div class="app">
    <DeviceWarningModal />
    <Communication />
    <main>
      {{outlet}}
    </main>
  </div>
</template>
