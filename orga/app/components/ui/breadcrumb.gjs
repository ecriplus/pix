import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';

const formatedLinks = (links) =>
  links.map((link, index) => ({
    ...link,
    label: link.label?.trim(),
    ariaCurrent: index === links.length - 1 ? 'page' : false,
  }));

<template>
  <nav aria-label={{t "common.breadcrumb"}} class="breadcrumb" ...attributes>
    <ol>
      {{#each (formatedLinks @links) as |link|}}
        <li>
          {{#if link.models}}
            <LinkTo @route="{{link.route}}" @models={{link.models}} aria-current={{link.ariaCurrent}}>
              {{link.label}}
            </LinkTo>
          {{else if link.model}}
            <LinkTo @route="{{link.route}}" @model={{link.model}} aria-current={{link.ariaCurrent}}>
              {{link.label}}
            </LinkTo>
          {{else if link.route}}
            <LinkTo @route="{{link.route}}" aria-current={{link.ariaCurrent}}>
              {{link.label}}
            </LinkTo>
          {{else}}
            {{link.label}}
          {{/if}}
        </li>
      {{/each}}
    </ol>
  </nav>
</template>
