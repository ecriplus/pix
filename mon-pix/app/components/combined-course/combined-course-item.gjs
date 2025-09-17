import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

import { CombinedCourseItemTypes } from '../../models/combined-course-item';

const Content = <template>
  <div class="combined-course-item" ...attributes>
    <div class="combined-course-item__content">
      <div class="combined-course-item__icon">
        {{#if @iconUrl}}
          <img role="presentation" src={{@iconUrl}} alt="" height="42" />
        {{/if}}
      </div>
      <div class="combined-course-item__text">
        <div class="combined-course-item__title">{{@title}}</div>
        <div class="combined-course-item__description">
          {{yield to="description"}}
        </div>
      </div>
      <div class="combined-course-item__duration">
        {{yield to="duration"}}
      </div>
    </div>
    {{#if @isLocked}}
      <div class="combined-course-item__indicator--locked">
        <PixIcon @name="lock" @plainIcon={{true}} @ariaHidden={{true}} />
      </div>
    {{/if}}
    {{#if @isCompleted}}
      <div class="combined-course-item__indicator--completed">
        <span>{{t "pages.combined-courses.items.completed"}}</span>
        <PixIcon @name="checkCircle" @plainIcon={{true}} class="combined-course-item__icon" @ariaHidden={{true}} />
      </div>

    {{/if}}
    {{#if (has-block "blockEnd")}}
      {{yield to="blockEnd"}}
    {{/if}}
  </div>
</template>;

const Duration = <template>
  <PixIcon @name="time" class="combined-course-item__duration__icon" /><span>{{t
      "pages.combined-courses.items.approximatelySymbol"
    }}{{@item.duration}}
    {{t "pages.combined-courses.items.durationUnit"}}</span>
</template>;

<template>
  {{#if (eq @item.type CombinedCourseItemTypes.FORMATION)}}
    <Content
      @title={{t "pages.combined-courses.items.formation.title"}}
      @isLocked={{true}}
      @iconUrl={{@item.iconUrl}}
      class="combined-course-item--formation"
    >
      <:description>
        <p>{{t "pages.combined-courses.items.formation.description"}}</p>
      </:description>
    </Content>
  {{else}}
    {{#if @isLocked}}
      <Content @title={{@item.title}} @isLocked={{true}} @iconUrl={{@item.iconUrl}}>
        <:duration>
          {{#if @item.duration}}<Duration @item={{@item}} />{{/if}}
        </:duration>
      </Content>
    {{else}}
      <LinkTo
        {{on "click" @onClick}}
        @route={{@item.route}}
        @model={{@item.reference}}
        @query={{hash redirection=@item.redirection}}
        disabled
      >
        <Content @title={{@item.title}} @isCompleted={{@item.isCompleted}} @iconUrl={{@item.iconUrl}}>
          <:duration>
            {{#if @item.duration}}
              <Duration @item={{@item}} />
            {{/if}}
          </:duration>
          <:blockEnd>
            {{#if @isNextItemToComplete}}
              <PixTag @color="purple-light" class="combined-course-item__current-item-tag">{{t
                  "pages.combined-courses.items.tagText"
                }}
                <PixIcon @name="distance" @ariaHidden={{true}} /></PixTag>
            {{/if}}
          </:blockEnd>
        </Content>

      </LinkTo>
    {{/if}}
  {{/if}}
</template>
