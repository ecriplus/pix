import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  currentUser: service(),

  renderTemplate() {
    this.render('authenticated.terms-of-service', {
    into: 'application'
    })
  },

  beforeModel() {
    this.get('currentUser').load()
      .then((user) => {
        if (user.pixOrgaTermsOfServiceAccepted) {
          return this.transitionTo('authenticated.campaigns.list');
        }
      })
      .catch(() => {
        return this.transitionTo('authenticated');
      });
  }
});
