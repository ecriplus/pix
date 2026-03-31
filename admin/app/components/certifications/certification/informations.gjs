import PixBlock from '@1024pix/pix-ui/components/pix-block';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

import CertificationCompetenceList from '../competence-list';
import CertificationComments from './comments';
import CertificationInformationCandidate from './informations/candidate';
import CertificationInformationGlobalActions from './informations/global-actions';
import CertificationInformationIssueReports from './informations/issue-reports';
import PixPlusEduV2Results from './informations/pix-plus-edu-v2-results';
import PixPlusEduV3Results from './informations/pix-plus-edu-v3-results';
import CertificationInformationState from './informations/state';

<template>
  <div class="certification-information">
    <div class="certification-information__buttons-row">
      <CertificationInformationGlobalActions @certification={{@certification}} @session={{@session}} />
    </div>
    <div class="certification-information__block-row">
      <CertificationInformationState @certification={{@certification}} @session={{@session}} />
      <CertificationInformationCandidate @certification={{@certification}} />
    </div>

    {{#if @certification.hasComplementaryCertifications}}
      <PixBlock @variant="admin">
        <div>
          {{#if @certification.commonComplementaryCertificationCourseResult}}
            <h2 class="certification-information__title">Certification complémentaire</h2>

            <DescriptionList
              data-testid="pw-certification-information-complementary"
              class="certification-information-complementary"
            >
              <DescriptionList.Item @label={{@certification.commonComplementaryCertificationCourseResult.label}}>
                {{@certification.commonComplementaryCertificationCourseResult.status}}
              </DescriptionList.Item>
            </DescriptionList>
          {{/if}}

          {{#if @certification.complementaryCertificationCourseResultWithExternal}}
            <PixPlusEduV2Results
              @certification={{@certification}}
              @displayJuryLevelSelect={{@displayJuryLevelSelect}}
              @juryLevelOptions={{@juryLevelOptions}}
              @selectedJuryLevel={{@selectedJuryLevel}}
              @selectJuryLevel={{@selectJuryLevel}}
              @onCancelJuryLevelEditButtonClick={{@onCancelJuryLevelEditButtonClick}}
              @onEditJuryLevelSave={{@onEditJuryLevelSave}}
              @shouldDisplayJuryLevelEditButton={{@shouldDisplayJuryLevelEditButton}}
              @editJury={{@editJury}}
            />
          {{else if @certification.isPixPlusEduV3}}
            <PixPlusEduV3Results />
          {{/if}}
        </div>
      </PixBlock>
    {{/if}}

    {{#if @certificationIssueReports.length}}
      <section class="certification-informations__row">
        <CertificationInformationIssueReports
          @certificationIssueReports={{@certificationIssueReports}}
          @certification={{@certification}}
        />
      </section>
    {{/if}}

    <CertificationComments @onJuryCommentSave={{@onJuryCommentSave}} @certification={{@certification}} />

    {{#if @certification.competences.length}}
      <PixBlock @variant="admin" class="certification-information-results">
        <h2 class="certification-information__title">Résultats</h2>

        <CertificationCompetenceList
          @competences={{@certification.competences}}
          @shouldDisplayPixScore={{@shouldDisplayPixScore}}
        />
      </PixBlock>
    {{/if}}
  </div>
</template>
