import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NewController extends Controller {
  @service pixToast;
  @service store;
  @service router;

  @action
  goBackToAutonomousCoursesList() {
    this.router.transitionTo('authenticated.autonomous-courses');
  }

  @action
  goToAutonomousCourseDetails(autonomousCourseId) {
    this.router.transitionTo('authenticated.autonomous-courses.details', autonomousCourseId);
  }

  @action
  async createAutonomousCourse(autonomousCourse) {
    try {
      const { id: autonomousCourseId } = await this.store.createRecord('autonomous-course', autonomousCourse).save();
      this.pixToast.sendSuccessNotification({ message: 'Le parcours autonome a été créé avec succès.' });
      this.goToAutonomousCourseDetails(autonomousCourseId);
    } catch (error) {
      if (!autonomousCourse.targetProfileId) {
        return this.pixToast.sendErrorNotification({ message: 'Aucun profil cible sélectionné !' });
      }
      if (error.errors[0]?.detail) {
        return this.pixToast.sendErrorNotification({ message: error.errors[0].detail });
      } else {
        return this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
      }
    }
  }
}
