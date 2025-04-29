import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import orderBy from 'lodash/orderBy';
import Grid from 'mon-pix/components/campaign-participation-overview/grid';
import List from 'mon-pix/components/competence-card/list';
import Banner from 'mon-pix/components/dashboard/banner';
import Section from 'mon-pix/components/dashboard/section';
import HexagonScore from 'mon-pix/components/hexagon-score';
import NewInformation from 'mon-pix/components/new-information';
import PageTitle from 'mon-pix/components/ui/page-title';

export default class Content extends Component {
  <template>
    <main id="main" role="main" class="global-page-container">
      <h1 class="sr-only">{{t "pages.dashboard.title"}}</h1>

      <PageTitle>
        <:title>{{t "pages.dashboard.welcome" firstName=this.userFirstname}}</:title>
      </PageTitle>

      <div class="dashboard-content">
        {{! This banner is displayed on tablet }}
        <Banner
          @show={{this.hasNewInformationToShow}}
          @hasSeenNewDashboardInfo={{this.hasSeenNewDashboardInfo}}
          @newDashboardInfoLink={{this.newDashboardInfoLink}}
          @closeInformationAboutNewDashboard={{this.closeInformationAboutNewDashboard}}
          @userFirstname={{this.userFirstname}}
          @code={{this.codeForLastProfileToShare}}
        />

        <section class="dashboard-content__score">
          <div class="dashboard-content-score__wrapper">
            <HexagonScore
              @pixScore={{this.userScore}}
              @maxReachablePixScore={{this.maxReachablePixScore}}
              @maxReachableLevel={{this.maxReachableLevel}}
            />
            <LinkTo @route="authenticated.profile" class="dashboard-content-score-wrapper__link">
              {{t "pages.dashboard.score.profile-link"}}
            </LinkTo>
          </div>
        </section>

        <section class="dashboard-content__main">
          {{! This banner is displayed on large screens }}
          <Banner
            @show={{this.hasNewInformationToShow}}
            @hasSeenNewDashboardInfo={{this.hasSeenNewDashboardInfo}}
            @newDashboardInfoLink={{this.newDashboardInfoLink}}
            @closeInformationAboutNewDashboard={{this.closeInformationAboutNewDashboard}}
            @userFirstname={{this.userFirstname}}
            @code={{this.codeForLastProfileToShare}}
          />

          {{#if this.hasNothingToShow}}
            <section>
              <div>
                <NewInformation
                  @information="{{t 'pages.dashboard.empty-dashboard.message'}}"
                  @image="/images/illustrations/fusee.png"
                  @variantClass="new-information--yellow-background"
                  @linkText={{t "pages.dashboard.empty-dashboard.link-to-competences"}}
                  @linkTo="authenticated.profile"
                  @linkDisplayType="button"
                  @textColorClass="new-information--black-text"
                />
              </div>
            </section>
          {{/if}}

          {{#if this.hasCampaignParticipationOverviews}}
            <Section
              @title={{t "pages.dashboard.campaigns.title"}}
              @subtitle={{t "pages.dashboard.campaigns.subtitle"}}
              @linkRoute="authenticated.user-tests"
              @linkText={{t "pages.dashboard.campaigns.tests-link"}}
            >
              <Grid @model={{@model.campaignParticipationOverviews}} />
            </Section>
          {{/if}}

          {{#if this.hasStartedCompetences}}
            <Section
              @title={{t "pages.dashboard.started-competences.title"}}
              @subtitle={{t "pages.dashboard.started-competences.subtitle"}}
            >
              <List @scorecards={{this.startedCompetences}} />
            </Section>
          {{/if}}

          {{#if this.hasRecommendedCompetences}}
            <Section
              @title={{t "pages.dashboard.recommended-competences.title"}}
              @subtitle={{t "pages.dashboard.recommended-competences.subtitle"}}
              @linkRoute="authenticated.profile"
              @linkText={{t "pages.dashboard.recommended-competences.profile-link"}}
              @ariaLabelLink={{t "pages.dashboard.recommended-competences.extra-information"}}
            >
              <List @scorecards={{this.recommendedScorecards}} />
            </Section>
          {{/if}}

          {{#if this.hasImprovableCompetences}}
            <Section
              @title={{t "pages.dashboard.improvable-competences.title"}}
              @subtitle={{t "pages.dashboard.improvable-competences.subtitle"}}
              @linkRoute="authenticated.profile"
              @linkText={{t "pages.dashboard.improvable-competences.profile-link"}}
              @ariaLabelLink={{t "pages.dashboard.improvable-competences.extra-information"}}
            >
              <List @scorecards={{this.improvableScorecards}} />
            </Section>
          {{/if}}
        </section>

        <section class="dashboard-content__certif">
          <!-- Rajout du bloc certif ultérieurement -->
          <!-- Div ajoutée afin de créer le layout Grid CSS -->
        </section>
      </div>

    </main>
  </template>
  MAX_SCORECARDS_TO_DISPLAY = 4;

  @service currentUser;
  @service currentDomain;
  @service intl;

  get hasNothingToShow() {
    return !this.hasCampaignParticipationOverviews && !this.hasStartedCompetences && !this.hasRecommendedCompetences;
  }

  get hasNewInformationToShow() {
    return Boolean(this.codeForLastProfileToShare || !this.hasSeenNewDashboardInfo);
  }

  get hasCampaignParticipationOverviews() {
    const campaignParticipationOverviews = this.args.model.campaignParticipationOverviews;
    return campaignParticipationOverviews && campaignParticipationOverviews.length > 0;
  }

  get hasRecommendedCompetences() {
    return this.recommendedScorecards.length > 0;
  }

  get hasStartedCompetences() {
    return this.startedCompetences.length > 0;
  }

  get hasImprovableCompetences() {
    return this.improvableScorecards.length > 0;
  }

  get recommendedScorecards() {
    const isScorecardNotStarted = (scorecard) => scorecard.isNotStarted;
    return this._filterScorecardsByStateAndRetrieveTheFirstOnesByIndex(isScorecardNotStarted);
  }

  get startedCompetences() {
    const isScorecardStarted = (scorecard) => scorecard.isStarted;
    return this._filterScorecardsByStateAndRetrieveTheFirstOnesByIndex(isScorecardStarted);
  }

  get improvableScorecards() {
    const isScorecardImprovable = (scorecard) => scorecard.isImprovable;
    return this._filterScorecardsByStateAndRetrieveTheFirstOnesByIndex(isScorecardImprovable);
  }

  _filterScorecardsByStateAndRetrieveTheFirstOnesByIndex(state) {
    const scorecards = this.args.model.scorecards;
    const filteredScorecards = scorecards.filter(state);
    const orderedAndFilteredScorecards = orderBy(filteredScorecards, ['index']);
    return orderedAndFilteredScorecards.slice(0, this.MAX_SCORECARDS_TO_DISPLAY);
  }

  get userFirstname() {
    return this.currentUser.user.firstName;
  }

  get codeForLastProfileToShare() {
    return this.currentUser.user.codeForLastProfileToShare;
  }

  get hasSeenNewDashboardInfo() {
    return this.currentUser.user.hasSeenNewDashboardInfo;
  }

  get userScore() {
    return this.currentUser.user.profile.get('pixScore');
  }

  get maxReachablePixScore() {
    return this.currentUser.user.profile.get('maxReachablePixScore');
  }

  get maxReachableLevel() {
    return this.currentUser.user.profile.get('maxReachableLevel');
  }

  @action
  async closeInformationAboutNewDashboard() {
    await this.currentUser.user.save({ adapterOptions: { rememberUserHasSeenNewDashboardInfo: true } });
  }

  get newDashboardInfoLink() {
    return {
      text: this.currentDomain.isFranceDomain ? this.intl.t('pages.dashboard.presentation.link.text') : null,
      url: this.currentDomain.isFranceDomain ? this.intl.t('pages.dashboard.presentation.link.url') : null,
    };
  }
}
