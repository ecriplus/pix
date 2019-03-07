import { inject as service } from '@ember/service';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BaseRoute from 'mon-pix/routes/base-route';

export default BaseRoute.extend(AuthenticatedRouteMixin, {

  session: service(),

  model() {
    const store = this.get('store');
    return store.findRecord('user', this.get('session.data.authenticated.userId'), { reload: true })
      .then((user) => {
        if (user.get('organizations.length') > 0) {
          return this.transitionTo('board');
        }
        return user;
      });
  },
});
