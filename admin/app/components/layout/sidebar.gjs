import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixNavigation from '@1024pix/pix-ui/components/pix-navigation';
import PixNavigationButton from '@1024pix/pix-ui/components/pix-navigation-button';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { or } from 'ember-truth-helpers';

export default class Sidebar extends Component {
  @service session;
  @service currentUser;
  @service accessControl;

  get userFullName() {
    const adminMember = this.currentUser?.adminMember;
    return `${adminMember?.firstName} ${adminMember?.lastName}`;
  }

  <template>
    <PixNavigation @menuLabel="Menu">
      <:brand>
        <LinkTo @route="authenticated.index">
          <img src="/admin-logo.svg" alt={{t "common.home-page"}} />
        </LinkTo>
      </:brand>
      <:navElements>
        <ul>
          <li>
            <PixNavigationButton
              class="sidebar__link"
              @route="authenticated.organizations"
              @icon="buildings"
              @ariaHidden={{true}}
            >
              {{t "components.layout.sidebar.organizations"}}
            </PixNavigationButton>
          </li>
          <li>
            <PixNavigationButton class="sidebar__link" @route="authenticated.users" @icon="infoUser">
              {{t "components.layout.sidebar.users"}}
            </PixNavigationButton>
          </li>
          <PixNavigationButton class="sidebar__link" @route="authenticated.certification-centers" @icon="mapPin">
            {{t "components.layout.sidebar.certification-centers"}}
          </PixNavigationButton>
          <li>
            <PixNavigationButton class="sidebar__link" @route="authenticated.sessions" @icon="session">
              {{t "components.layout.sidebar.sessions"}}
            </PixNavigationButton>
          </li>
          {{#if this.accessControl.hasAccessToCertificationActionsScope}}
            <li>
              <PixNavigationButton class="sidebar__link" @route="authenticated.certifications" @icon="newRealease">
                {{t "components.layout.sidebar.certifications"}}
              </PixNavigationButton>
            </li>
          {{/if}}
          <li>
            <PixNavigationButton
              class="sidebar__link"
              @route="authenticated.complementary-certifications"
              @icon="extension"
            >
              {{t "components.layout.sidebar.complementary-certifications"}}
            </PixNavigationButton>
          </li>
          {{#if this.accessControl.hasAccessToTargetProfilesActionsScope}}
            <li>
              <PixNavigationButton class="sidebar__link" @route="authenticated.target-profiles" @icon="assignment">
                {{t "components.layout.sidebar.target-profiles"}}
              </PixNavigationButton>
            </li>
          {{/if}}

          {{#if
            (or
              this.currentUser.adminMember.isSuperAdmin
              this.currentUser.adminMember.isMetier
              this.currentUser.adminMember.isSupport
            )
          }}
            <li>
              <PixNavigationButton class="sidebar__link" @route="authenticated.autonomous-courses" @icon="signpost">
                {{t "components.layout.sidebar.autonomous-courses"}}
              </PixNavigationButton>
            </li>
          {{/if}}

          {{#if this.currentUser.adminMember.isSuperAdmin}}
            <li>
              <PixNavigationButton class="sidebar__link" @route="authenticated.team" @icon="users">
                {{t "components.layout.sidebar.team"}}
              </PixNavigationButton>
            </li>
          {{/if}}

          {{#if this.accessControl.hasAccessToTrainings}}
            <li>
              <PixNavigationButton class="sidebar__link" @route="authenticated.trainings" @icon="book">
                {{t "components.layout.sidebar.trainings"}}
              </PixNavigationButton>
            </li>
          {{/if}}
          {{#if (or this.currentUser.adminMember.isSuperAdmin this.currentUser.adminMember.isMetier)}}
            <li>
              <PixNavigationButton class="sidebar__link" @route="authenticated.tools" @icon="tools">
                {{t "components.layout.sidebar.tools"}}
              </PixNavigationButton>
            </li>
          {{/if}}
          {{#if this.currentUser.adminMember.isSuperAdmin}}
            <li>
              <PixNavigationButton class="sidebar__link" @route="authenticated.administration" @icon="shieldPerson">
                {{t "components.layout.sidebar.administration"}}
              </PixNavigationButton>
            </li>
          {{/if}}

        </ul>
      </:navElements>
      <:footer>

        <p class="sidebar-footer__full-name">{{this.userFullName}}</p>

        <PixButtonLink @variant="tertiary" @route="logout">{{t "components.layout.sidebar.logout"}}</PixButtonLink>

      </:footer>
    </PixNavigation>
  </template>
}
