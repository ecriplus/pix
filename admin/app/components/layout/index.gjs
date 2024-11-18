import PixToastContainer from '@1024pix/pix-ui/components/pix-toast-container';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';
import { pageTitle } from 'ember-page-title';

import MenuBar from './menu-bar';

<template>
  {{pageTitle "Pix Admin" separator=" | "}}
  <div class="app-container">

    <aside class="app-sidebar">
      <header class="app-logo">
        <LinkTo @route="authenticated.index" class="app-logo__link">
          PIX
        </LinkTo>
      </header>
      <MenuBar />
    </aside>

    <div class="app-body">
      <div class="page">
        {{yield}}
      </div>
    </div>

    <PixToastContainer @closeButtonAriaLabel={{t "common.notifications.close-button.extra-information"}} />

  </div>
</template>
