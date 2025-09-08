import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';
import { not } from 'ember-truth-helpers';

import { formatDate } from '../../helpers/format-date';
import ConfirmPopup from '../confirm-popup';
import JuryComment from './jury-comment';

function getFormattedDate(param) {
  return formatDate([param]);
}

<template>
  <section class="page-section">
    <div class="session-info">

      <div class="session-info__certification-officer-assigned">
        <span>{{@sessionModel.assignedCertificationOfficer.fullName}}</span>
      </div>

      <ul class="session-info__list">
        <li class="session-info__list-item">
          <span>Centre de certification :</span>
          <span>
            <LinkTo @route="authenticated.certification-centers.get" @model={{@sessionModel.certificationCenterId}}>
              {{@sessionModel.certificationCenterName}}
            </LinkTo>
          </span>
        </li>
        <li class="session-info__list-item">
          <span>Nom du site :</span>
          <span>{{@sessionModel.address}}</span>
        </li>
        <li class="session-info__list-item">
          <span>Nom de la salle :</span>
          <span>{{@sessionModel.room}}</span>
        </li>

        <li class="session-info__list-item">
          <span>Date et heure de la session :</span>
          <span>{{getFormattedDate @sessionModel.date}} à {{@sessionModel.time}}</span>
        </li>
        <li class="session-info__list-item">
          <span>Surveillant :</span>
          <span>{{@sessionModel.examiner}}</span>
        </li>
        <li class="session-info__list-item">
          <span>Description :</span>
          <span>{{@sessionModel.description}}</span>
        </li>
        <li class="session-info__list-item">
          <span>Code d'accès :</span>
          <span>{{@sessionModel.accessCode}}</span>
        </li>
      </ul>
      <ul class="session-info__list">
        <li class="session-info__list-item">
          <span>Statut :</span>
          <span>{{@sessionModel.displayStatus}}</span>
        </li>
        <li class="session-info__list-item">
          <span>Date de création :</span>
          <span>{{getFormattedDate @sessionModel.createdAt}}</span>
        </li>
        {{#if @sessionModel.finalizedAt}}
          <li class="session-info__list-item">
            <span>Date de finalisation :</span>
            <span>{{getFormattedDate @sessionModel.finalizedAt}}</span>
          </li>
        {{/if}}
        {{#if @sessionModel.publishedAt}}
          <li class="session-info__list-item">
            <span>Date de publication :</span>
            <span>{{getFormattedDate @sessionModel.publishedAt}}</span>
          </li>
        {{/if}}
        {{#if @sessionModel.resultsSentToPrescriberAt}}
          <li class="session-info__list-item">
            <span>Date d'envoi des résultats au prescripteur :</span>
            <span>{{getFormattedDate @sessionModel.resultsSentToPrescriberAt}}</span>
          </li>
        {{/if}}
      </ul>

      <ul class="session-info__list">
        <li class="session-info__list-item">
          <span>Nombre de certification(s) démarrée(s) :</span>
          <span>{{@sessionModel.numberOfStartedCertifications}}</span>
        </li>
        {{#if @sessionModel.finalizedAt}}
          <li class="session-info__list-item">
            <span>Nombre de signalement(s) impactant(s) non résolu(s) :</span>
            <span>{{@sessionModel.numberOfImpactfullIssueReports}}</span>
          </li>
          <li class="session-info__list-item">
            <span>Nombre de signalement(s) :</span>
            <span>{{@sessionModel.totalNumberOfIssueReports}}</span>
          </li>
          <li class="session-info__list-item">
            <span>Nombre de certification(s) en erreur :</span>
            <span>{{@sessionModel.numberOfScoringErrors}}</span>
          </li>
          {{#if @sessionModel.hasComplementaryInfo}}
            <li class="session-info__list-item">
              <span>Informations complémentaires :</span>
              {{#if @sessionModel.hasIncident}}
                <span>Malgré un incident survenu pendant la session, les candidats ont pu terminer leur test de
                  certification. Un temps supplémentaire a été accordé à un ou plusieurs candidats.</span>
              {{/if}}
              {{#if @sessionModel.hasJoiningIssue}}
                <span>Un ou plusieurs candidats étaient présents en session de certification mais n'ont pas pu rejoindre
                  la session.</span>
              {{/if}}
            </li>
          {{/if}}
          {{#if @sessionModel.hasExaminerGlobalComment}}
            <li class="session-info__list-item">
              <span>Commentaire global :</span>
              <span>{{@sessionModel.examinerGlobalComment}}</span>
            </li>
          {{/if}}
        {{/if}}
      </ul>

      {{#if @accessControl.hasAccessToCertificationActionsScope}}
        <div class="session-info__actions">
          {{#if @sessionModel.finalizedAt}}
            {{#if @isCurrentUserAssignedToSession}}
              <PixButton @size="large" @isDisabled={{true}}>Vous êtes assigné à cette session</PixButton>
            {{else}}
              <PixButton @size="large" @triggerAction={{@checkForAssignment}}>M'assigner la session</PixButton>
            {{/if}}
            {{#if @sessionModel.isPublished}}
              <PixTooltip @position="right" @isWide={{true}}>
                <:triggerElement>
                  <PixButton
                    @size="large"
                    @isDisabled={{true}}
                    @triggerAction={{@onUnfinalizeSessionButtonClick}}
                    @variant="error"
                  >Définaliser la session
                  </PixButton>
                </:triggerElement>

                <:tooltip>Vous ne pouvez pas définaliser une session publiée. Merci de dépublier la session avant de la
                  définaliser.
                </:tooltip>
              </PixTooltip>
            {{else}}
              <PixButton @size="large" @triggerAction={{@onUnfinalizeSessionButtonClick}} @variant="error">Définaliser
                la session
              </PixButton>
            {{/if}}
          {{/if}}

          <div class="session-info__copy-button">
            {{#if @isCopyButtonClicked}}
              <p>{{@copyButtonText}}</p>
            {{/if}}

            <PixButton
              @size="small"
              @triggerAction={{@copyResultsDownloadLink}}
              @variant="secondary"
              @iconBefore="copy"
              @plainIconBefore={{true}}
            >
              Lien de téléchargement des résultats
            </PixButton>
          </div>

          <div class="session-info__published-buttons">
            <PixButton
              @triggerAction={{@downloadPDFAttestations}}
              @variant="secondary"
              class="session-info__download-button"
              @isDisabled={{not @sessionModel.isPublished}}
              @iconBefore="download"
            >
              {{t "pages.sessions.informations.actions.download-certificates"}}
            </PixButton>
          </div>
        </div>
      {{/if}}
    </div>
  </section>

  <JuryComment
    @author={{@sessionModel.juryCommentAuthor.fullName}}
    @date={{@sessionModel.juryCommentedAt}}
    @comment={{@sessionModel.juryComment}}
    @onFormSubmit={{@saveComment}}
    @onDeleteButtonClicked={{@deleteComment}}
  />

  <ConfirmPopup
    @title={{@modalTitle}}
    @message={{@modalMessage}}
    @confirm={{@modalConfirmAction}}
    @cancel={{@cancelModal}}
    @show={{@isShowingModal}}
  />
</template>
