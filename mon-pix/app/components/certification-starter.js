import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  router: service(),
  // Element
  classNames: ['certification-starter'],

  // Dependency injection
  store: service(),

  // Public props
  onSubmit: null,
  onError: null,

  // Internal props
  _accessCode: '',
  _errorMessage: null,
  _loadingCertification: false,

  actions: {

    submit() {
      this.set('_errorMessage', null);
      const accessCode = this._accessCode;
      if (accessCode) {
        this.set('_loadingCertification', true);
        return this.store
          .createRecord('course', { accessCode })
          .save()
          .then((certificationCourse) => {
            this.set('_loadingCertification', false);
            this.router.replaceWith('certifications.resume', certificationCourse.id);
          })
          .catch((error) => {
            this.set('_loadingCertification', false);
            if (error.errors[0].status === '404') {
              this.set('_errorMessage', 'Ce code n’existe pas ou n’est plus valide.');
            } else {
              if (error.errors[0].status === '403') {
                return this.router.render('certifications.start-error');
              } else {
                this.router.transitionTo('index');
              }
            }
          });
      } else {
        this.set('_errorMessage', 'Merci de saisir un code d’accès valide.');
      }
    }
  }
});
