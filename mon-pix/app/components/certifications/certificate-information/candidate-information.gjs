import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';

<template>
  <PixBlock class="candidate-information">
    <div class="candidate-information__score">
      <div class="candidate-information-score__hexagon">
        <span class="candidate-information-score-hexagon__pix">{{t "common.pix"}}</span>
        <span class="candidate-information-score-hexagon__score">{{@certificate.pixScore}}</span>
        <span class="candidate-information-score-hexagon__certified">{{t
            "pages.certificate.hexagon-score.certified"
          }}</span>
      </div>
      {{#if @certificate.globalLevelLabel}}
        <PixTag data-testid="global-level-label-tag">{{@certificate.globalLevelLabel}}</PixTag>
      {{/if}}
    </div>
    <div>
      <ul class="candidate-information__list">
        <li class="candidate-information-list--bold candidate-information-list__firstName">
          {{t "pages.certificate.candidate"}}
          {{@certificate.firstName}}
          {{@certificate.lastName}}
        </li>
        <li>
          {{t
            "pages.certificate.candidate-birth-complete"
            birthdate=(dayjsFormat @certificate.birthdate "DD/MM/YYYY")
            birthplace=@certificate.birthplace
          }}
        </li>
        <li class="candidate-information-list--bold">
          {{t "pages.certificate.certification-center"}}
          {{@certificate.certificationCenter}}
        </li>
        <li>
          {{t "pages.certificate.certification-date"}}
          {{dayjsFormat @certificate.certificationDate "DD/MM/YYYY"}}
        </li>
        <li>
          {{t "pages.certificate.delivered-at"}}
          {{dayjsFormat @certificate.deliveredAt "DD/MM/YYYY"}}
        </li>
      </ul>
    </div>
  </PixBlock>
</template>
