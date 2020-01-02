import { click, find, findAll } from '@ember/test-helpers';
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import visitWithAbortedTransition from '../helpers/visit';
import defaultScenario from '../../mirage/scenarios/default';
import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';

describe('Acceptance | Displaying a QCU', function() {
  setupApplicationTest();
  setupMirage();

  beforeEach(function() {
    defaultScenario(this.server);
  });

  context('Challenge answered: the answers radio buttons should be disabled', function() {
    beforeEach(async function() {
      const assessment = server.create('assessment');
      const challenge = server.create('challenge', {
        type: 'QCU',
        'illustration-url': 'http://fakeimg.pl/350x200/?text=QCU',
        attachments: ['file.docx', 'file.odt'],
        instruction: 'Un QCU propose plusieurs choix, l\'utilisateur peut en choisir [un seul](http://link.unseul.url)',
        proposals: '' +
          '- 1ere possibilite\n ' +
          '- 2eme possibilite\n ' +
          '- 3eme possibilite\n' +
          '- 4eme possibilite',
        'embed-url': 'https://1024pix.github.io/dessin.html',
        'embed-title': 'Notre premier embed',
        'embed-height': 600
      });
      server.create('answer', {
        value: 2,
        result: 'ok',
        challengeId: challenge.id,
        assessmentId: assessment.id,
      });

      await visitWithAbortedTransition('/assessments/' + assessment.id + '/challenges/' + challenge.id);
    });

    it('should preselect radio buttons accordingly', async function() {
      expect(findAll('input[type=radio][name="radio"]')[0].checked).to.equal(false);
      expect(findAll('input[type=radio][name="radio"]')[1].checked).to.equal(true);
      expect(findAll('input[type=radio][name="radio"]')[2].checked).to.equal(false);
      expect(findAll('input[type=radio][name="radio"]')[3].checked).to.equal(false);

      findAll('input[type=radio][name="radio"]').forEach((radioButton) => expect(radioButton.disabled).to.equal(true));
    });

    it('should display the previously saved selected radio button by default', async function() {
      expect(findAll('.proposal-paragraph input[type=radio][name="radio"]')[1].checked).to.be.true;
    });
  });

  context('Challenge not answered', function() {
    beforeEach(async function() {
      await visitWithAbortedTransition('/assessments/ref_assessment_id/challenges/ref_qcu_challenge_id');
    });

    it('should display a radio buttons list', async function() {
      expect(findAll('input[type=radio][name="radio"]')).to.have.lengthOf(4);
    });

    it('should display an ordered list of instructions', async function() {
      expect(findAll('.proposal-text')[0].textContent.trim()).to.equal('1ere possibilite');
      expect(findAll('.proposal-text')[1].textContent.trim()).to.equal('2eme possibilite');
      expect(findAll('.proposal-text')[2].textContent.trim()).to.equal('3eme possibilite');
      expect(findAll('.proposal-text')[3].textContent.trim()).to.equal('4eme possibilite');
    });

    it('should display the error alter box if users validates with no radio button selected', async function() {
      // given
      findAll('input[type=radio][name="radio"]')[1].checked = false;

      // when
      await click('.challenge-actions__action-validate');

      // then
      expect(find('.alert')).to.exist;
      expect(find('.alert').textContent.trim()).to.equal('Pour valider, sélectionner une réponse. Sinon, passer.');
    });

    it('should only display an error alert if the user tries to validate after having interacting once with the page', async function() {
      // given
      findAll('input[type=radio][name="radio"]')[1].checked = false;
      await click('.challenge-actions__action-validate');

      // when
      await click(findAll('.label-checkbox-proposal')[0]);

      // then
      expect(find('.alert')).to.not.exist;
    });
  });
});
