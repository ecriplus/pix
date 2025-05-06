import eq from 'ember-truth-helpers/helpers/eq';
import Deleted from 'mon-pix/components/campaign-participation-overview/card/deleted';
import Disabled from 'mon-pix/components/campaign-participation-overview/card/disabled';
import Ended from 'mon-pix/components/campaign-participation-overview/card/ended';
import Ongoing from 'mon-pix/components/campaign-participation-overview/card/ongoing';
import ToShare from 'mon-pix/components/campaign-participation-overview/card/to-share';
<template>
  {{#if (eq @model.cardStatus "ONGOING")}}
    <Ongoing @model={{@model}} />
  {{else if (eq @model.cardStatus "TO_SHARE")}}
    <ToShare @model={{@model}} />
  {{else if (eq @model.cardStatus "ENDED")}}
    <Ended @model={{@model}} />
  {{else if (eq @model.cardStatus "DISABLED")}}
    <Disabled @model={{@model}} />
  {{else if (eq @model.cardStatus "DELETED")}}
    <Deleted @model={{@model}} />
  {{/if}}
</template>
