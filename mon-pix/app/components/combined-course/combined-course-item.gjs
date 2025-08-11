import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { hash } from '@ember/helper';
import { LinkTo } from '@ember/routing';

const Content = <template>
  <div class="combined-course-item">
    <div class="combined-course-item__title">{{@title}}</div>
    {{#if @isLocked}}
      <PixIcon @name="lock" @plainIcon={{true}} />
    {{/if}}
  </div>
</template>;

<template>
  {{#if @isLocked}}
    <Content @title={{@item.title}} @isLocked={{true}} />
  {{else}}
    <LinkTo @route={{@item.route}} @model={{@item.reference}} @query={{hash redirection=@item.redirection}} disabled>
      <Content @title={{@item.title}} />
    </LinkTo>
  {{/if}}
</template>
