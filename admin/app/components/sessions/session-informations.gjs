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
          <span>{{t "pages.sessions.informations.labels.certification-center"}}</span>
          <span>
            <LinkTo @route="authenticated.certification-centers.get" @model={{@sessionModel.certificationCenterId}}>
              {{@sessionModel.certificationCenterName}}
            </LinkTo>
          </span>
        </li>
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.site-name"}}</span>
          <span>{{@sessionModel.address}}</span>
        </li>
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.room-name"}}</span>
          <span>{{@sessionModel.room}}</span>
        </li>

        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.session-date-time"}}</span>
          <span>{{getFormattedDate @sessionModel.date}} à {{@sessionModel.time}}</span>
        </li>
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.examiner"}}</span>
          <span>{{@sessionModel.examiner}}</span>
        </li>
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.description"}}</span>
          <span>{{@sessionModel.description}}</span>
        </li>
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.access-code"}}</span>
          <span>{{@sessionModel.accessCode}}</span>
        </li>
      </ul>
      <ul class="session-info__list">
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.status"}}</span>
          <span>{{@sessionModel.displayStatus}}</span>
        </li>
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.creation-date"}}</span>
          <span>{{getFormattedDate @sessionModel.createdAt}}</span>
        </li>
        {{#if @sessionModel.finalizedAt}}
          <li class="session-info__list-item">
            <span>{{t "pages.sessions.informations.labels.finalization-date"}}</span>
            <span>{{getFormattedDate @sessionModel.finalizedAt}}</span>
          </li>
        {{/if}}
        {{#if @sessionModel.publishedAt}}
          <li class="session-info__list-item">
            <span>{{t "pages.sessions.informations.labels.publication-date"}}</span>
            <span>{{getFormattedDate @sessionModel.publishedAt}}</span>
          </li>
        {{/if}}
        {{#if @sessionModel.resultsSentToPrescriberAt}}
          <li class="session-info__list-item">
            <span>{{t "pages.sessions.informations.labels.results-sent-date"}}</span>
            <span>{{getFormattedDate @sessionModel.resultsSentToPrescriberAt}}</span>
          </li>
        {{/if}}
      </ul>

      <ul class="session-info__list">
        <li class="session-info__list-item">
          <span>{{t "pages.sessions.informations.labels.started-certifications"}}</span>
          <span>{{@sessionModel.numberOfStartedCertifications}}</span>
        </li>
        {{#if @sessionModel.finalizedAt}}
          <li class="session-info__list-item">
            <span>{{t "pages.sessions.informations.labels.impactful-issues"}}</span>
            <span>{{@sessionModel.numberOfImpactfullIssueReports}}</span>
          </li>
          <li class="session-info__list-item">
            <span>{{t "pages.sessions.informations.labels.total-issues"}}</span>
            <span>{{@sessionModel.totalNumberOfIssueReports}}</span>
          </li>
          <li class="session-info__list-item">
            <span>{{t "pages.sessions.informations.labels.scoring-errors"}}</span>
            <span>{{@sessionModel.numberOfScoringErrors}}</span>
          </li>
          {{#if @sessionModel.hasComplementaryInfo}}
            <li class="session-info__list-item">
              <span>{{t "pages.sessions.informations.labels.complementary-info"}}</span>
              {{#if @sessionModel.hasIncident}}
                <span>{{t "pages.sessions.informations.messages.incident-info"}}</span>
              {{/if}}
              {{#if @sessionModel.hasJoiningIssue}}
                <span>{{t "pages.sessions.informations.messages.joining-issue-info"}}</span>
              {{/if}}
            </li>
          {{/if}}
          {{#if @sessionModel.hasExaminerGlobalComment}}
            <li class="session-info__list-item">
              <span>{{t "pages.sessions.informations.labels.global-comment"}}</span>
              <span>{{@sessionModel.examinerGlobalComment}}</span>
            </li>
          {{/if}}
        {{/if}}
      </ul>

      {{#if @accessControl.hasAccessToCertificationActionsScope}}
        <div class="session-info__actions">
          {{#if @sessionModel.finalizedAt}}
            {{#if @isCurrentUserAssignedToSession}}
              <PixButton @size="large" @isDisabled={{true}}>{{t
                  "pages.sessions.informations.buttons.assigned-to-session"
                }}</PixButton>
            {{else}}
              <PixButton @size="large" @triggerAction={{@checkForAssignment}}>{{t
                  "pages.sessions.informations.buttons.assign-session"
                }}</PixButton>
            {{/if}}
            {{#if @sessionModel.isPublished}}
              <PixTooltip @position="right" @isWide={{true}}>
                <:triggerElement>
                  <PixButton
                    @size="large"
                    @isDisabled={{true}}
                    @triggerAction={{@onUnfinalizeSessionButtonClick}}
                    @variant="error"
                  >{{t "pages.sessions.informations.buttons.unfinalize-session"}}
                  </PixButton>
                </:triggerElement>

                <:tooltip>{{t "pages.sessions.informations.tooltips.cannot-unfinalize-published"}}
                </:tooltip>
              </PixTooltip>
            {{else}}
              <PixButton @size="large" @triggerAction={{@onUnfinalizeSessionButtonClick}} @variant="error">{{t
                  "pages.sessions.informations.buttons.unfinalize-session"
                }}
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
              {{t "pages.sessions.informations.buttons.copy-results-link"}}
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
