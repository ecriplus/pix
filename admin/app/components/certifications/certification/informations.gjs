import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixSelect from '@1024pix/pix-ui/components/pix-select';

import CertificationCompetenceList from '../competence-list';
import CertificationInfoField from '../info-field';
import CertificationComments from './comments';
import CertificationInformationCandidate from './informations/candidate';
import CertificationInformationGlobalActions from './informations/global-actions';
import CertificationInformationIssueReports from './informations/issue-reports';
import CertificationInformationState from './informations/state';

<template>
  <div class="certification-informations">
    <div class="certification-informations__row">
      <CertificationInformationGlobalActions @certification={{@certification}} @session={{@session}} />
    </div>
    <div class="certification-informations__row">
      <CertificationInformationState @certification={{@certification}} @session={{@session}} />
      <CertificationInformationCandidate @certification={{@certification}} />
    </div>

    {{#if @certification.hasComplementaryCertifications}}
      <div class="certification-informations__row">
        <div class="certification-informations__card">
          <h2 class="certification-informations__card__title">Certification complémentaire</h2>

          {{#if @certification.commonComplementaryCertificationCourseResult}}
            <ul class="certification-informations__card__list">
              <li class="certification-informations__card__list-item">
                <span class="certification-informations__card__list-label">
                  {{@certification.commonComplementaryCertificationCourseResult.label}}
                  :
                </span>
                {{@certification.commonComplementaryCertificationCourseResult.status}}
              </li>
            </ul>
          {{/if}}

          {{#if @certification.complementaryCertificationCourseResultWithExternal}}
            <section class="certification-informations__pix-edu">
              <h2 class="certification-informations__pix-edu__title">Résultats de la certification complémentaire Pix+
                Edu :</h2>
              <div class="certification-informations__row">
                <div class="certification-informations__card certification-informations__card--pix-edu">
                  <p>VOLET PIX</p>
                  <p class="certification-informations__card__score">
                    {{@certification.complementaryCertificationCourseResultWithExternal.pixResult}}
                  </p>
                </div>
                <div class="certification-informations__card certification-informations__card--pix-edu">
                  <p>VOLET JURY</p>
                  {{#if @displayJuryLevelSelect}}
                    <div class="certification-informations__pix-edu__row__jury-level-editor">
                      <section>
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
                      </section>
                      <section>
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
                      </section>
                    </div>
                  {{else}}
                    <div class="certification-informations__pix-edu__row__jury-level">
                      <p class="certification-informations__card__score">
                        {{@certification.complementaryCertificationCourseResultWithExternal.externalResult}}
                      </p>
                      {{#if @shouldDisplayJuryLevelEditButton}}
                        <PixIconButton
                          class="jury-level-edit-icon-button"
                          @ariaLabel="Modifier le volet jury"
                          @triggerAction={{@editJury}}
                          @iconName="edit"
                        />
                      {{/if}}
                    </div>
                  {{/if}}
                </div>
                <div class="certification-informations__card certification-informations__card--pix-edu">
                  <p>NIVEAU FINAL</p>
                  <p
                    class="certification-informations__card__score"
                  >{{@certification.complementaryCertificationCourseResultWithExternal.finalResult}}</p>
                </div>
              </div>
            </section>
          {{/if}}
        </div>
      </div>
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

    <div class="certification-informations__row">
      <div class="certification-informations__card">
        <h2 class="certification-informations__card__title">Résultats</h2>
        <CertificationInfoField
          @value={{@certification.pixScore}}
          @edition={{false}}
          @label="Score :"
          @fieldId="certification-pixScore"
          @suffix=" Pix"
        />

        <CertificationCompetenceList
          @competences={{@certification.competences}}
          @shouldDisplayPixScore={{@shouldDisplayPixScore}}
          @edition={{false}}
          @onUpdateScore={{@onUpdateScore}}
          @onUpdateLevel={{@onUpdateLevel}}
        />
      </div>
    </div>
  </div>
</template>
