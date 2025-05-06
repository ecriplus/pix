import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import LoginSessionSupervisorForm from './form';

export default class LoginSessionSupervisor extends Component {
  @service intl;

  <template>
    <div class='login-session-supervisor'>
      <main class='login-session-supervisor__main'>
        <header class='login-session-supervisor__header'>
          <img src='/illu-espace-surveillant.svg' alt='' />
          <h1>{{t 'pages.session-supervising.login.form.title'}}</h1>
          <h2>{{t 'pages.session-supervising.login.form.sub-title'}}</h2>
          <p>{{t 'common.form-errors.mandatory-all-fields'}}</p>
        </header>

        <LoginSessionSupervisorForm @authenticateSupervisor={{@authenticateSupervisor}} />

        <footer class='login-session-supervisor__footer'>
          <span class='user'>
            <PixIcon @name='userCircle' @plainIcon={{true}} class='footer-item__icon' @ariaHidden={{true}} />
            {{@currentUserEmail}}
          </span>
          <PixButtonLink class='logout-link' @route='logout' @variant='tertiary'>
            {{t 'pages.session-supervising.login.form.actions.switch-account'}}
          </PixButtonLink>
        </footer>
      </main>
    </div>
  </template>
}
