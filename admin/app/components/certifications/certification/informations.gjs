import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

import CertificationCompetenceList from '../competence-list';
import CertificationComments from './comments';
import CertificationInformationCandidate from './informations/candidate';
import CertificationInformationGlobalActions from './informations/global-actions';
import CertificationInformationIssueReports from './informations/issue-reports';
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
            <div class="certification-information-pix-edu">
              <h2 class="certification-information__title">Résultats de la certification complémentaire Pix+ Edu</h2>
              <div class="certification-information-pix-edu__container">
                <div class="certification-information-pix-edu__card">
                  <h3>Volet Pix</h3>
                  <p>
                    {{@certification.complementaryCertificationCourseResultWithExternal.pixResult}}
                  </p>
                </div>
                <div class="certification-information-pix-edu__card">
                  <h3>Volet jury</h3>
                  {{#if @displayJuryLevelSelect}}
                    <div class="certification-information-pix-edu__jury-level-editor">
                      <PixSelect
                        @screenReaderOnly={{true}}
                        @options={{@juryLevelOptions}}
                        @value={{@selectedJuryLevel}}
                        @hideDefaultOption={{true}}
                        @onChange={{@selectJuryLevel}}
                        @placeholder="Choisir un niveau"
                      >
                        <:label>Sélectionner un niveau</:label>
                      </PixSelect>
                      <div>
                        <PixButton
                          @variant="secondary"
                          @size="small"
                          @triggerAction={{@onCancelJuryLevelEditButtonClick}}
                        >
                          Annuler
                        </PixButton>
                        <PixButton
                          @size="small"
                          @triggerAction={{@onEditJuryLevelSave}}
                          aria-label="Modifier le niveau du jury"
                        >
                          Enregistrer
                        </PixButton>
                      </div>
                    </div>
                  {{else}}
                    <div class="certification-information-pix-edu__jury-level">
                      <p>
                        {{@certification.complementaryCertificationCourseResultWithExternal.externalResult}}
                      </p>
                      {{#if @shouldDisplayJuryLevelEditButton}}
                        <PixIconButton
                          @ariaLabel="Modifier le volet jury"
                          @triggerAction={{@editJury}}
                          @iconName="edit"
                        />
                      {{/if}}
                    </div>
                  {{/if}}
                </div>
                <div class="certification-information-pix-edu__card">
                  <h3>Niveau final</h3>
                  <p>{{@certification.complementaryCertificationCourseResultWithExternal.finalResult}}</p>
                </div>
              </div>
            </div>
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

    <PixBlock @variant="admin" class="certification-information-results">
      <h2 class="certification-information__title">Résultats</h2>

      <CertificationCompetenceList
        @competences={{@certification.competences}}
        @shouldDisplayPixScore={{@shouldDisplayPixScore}}
      />
    </PixBlock>
  </div>
</template>
