import PixBlock from '@1024pix/pix-ui/components/pix-block';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import LoginForm from 'pix-orga/components/authentication/login-form';
import AuthenticationLayout from 'pix-orga/components/authentication-layout/index';
import LocaleSwitcher from 'pix-orga/components/locale-switcher';
import PageTitle from 'pix-orga/components/ui/page-title';

<template>
  {{pageTitle (t "pages.login.title")}}
  {{#if @controller.isNewAuthDesignEnabled}}
    <AuthenticationLayout class="signin-page-layout">
      <:header>
      </:header>

      <:content>
        <div>
          <h1 class="pix-title-m">{{t "pages.login.title"}}</h1>
          <h3 class="pix-body-l">{{t "pages.login.with-pix-account"}}</h3>
        </div>

        <LoginForm
          @isWithInvitation={{false}}
          @hasInvitationAlreadyBeenAccepted={{@controller.hasInvitationAlreadyBeenAccepted}}
          @isInvitationCancelled={{@controller.isInvitationCancelled}}
        />
      </:content>
    </AuthenticationLayout>

  {{else}}
    <main class="login-page">
      <div>
        <PixBlock class="login-page__container" @variant="orga">
          <header class="login-page__header">
            <img src="/pix-orga-color.svg" alt="Pix Orga" />
            <PageTitle @centerTitle={{true}}>
              <:title>
                {{t "pages.login.title"}}
              </:title>
            </PageTitle>

          </header>

          <LoginForm
            @isWithInvitation={{false}}
            @hasInvitationAlreadyBeenAccepted={{@controller.hasInvitationAlreadyBeenAccepted}}
            @isInvitationCancelled={{@controller.isInvitationCancelled}}
          />
        </PixBlock>

        {{#if @controller.isInternationalDomain}}
          <LocaleSwitcher />
        {{/if}}
      </div>
    </main>
  {{/if}}
</template>
