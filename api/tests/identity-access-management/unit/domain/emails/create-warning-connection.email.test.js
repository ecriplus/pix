import { createWarningConnectionEmail } from '../../../../../src/identity-access-management/domain/emails/create-warning-connection.email.js';
import { Email } from '../../../../../src/shared/mail/domain/models/Email.js';
import { mailer } from '../../../../../src/shared/mail/infrastructure/services/mailer.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Domain | Email | create-warning-connection', function () {
  it('creates warning connection email with the right parameters', function () {
    const emailParams = {
      email: 'test@example.com',
      locale: 'fr',
      firstName: 'John',
    };

    const email = createWarningConnectionEmail(emailParams);

    expect(email).to.be.instanceof(Email);
    expect(email).to.have.property('subject').that.is.a('string');
    expect(email.to).to.equal(emailParams.email);
    expect(email.template).to.equal(mailer.warningConnectionTemplateId);

    const variables = email.variables;

    expect(variables).to.have.property('homeName').that.is.a('string');
    expect(variables).to.have.property('homeUrl').that.is.a('string');
    expect(variables).to.have.property('displayNationalLogo').that.is.a('boolean');
    expect(variables).to.have.property('contactUs').that.is.a('string');
    expect(variables).to.have.property('doNotAnswer').that.is.a('string');
    expect(variables).to.have.property('moreOn').that.is.a('string');
    expect(variables).to.have.property('pixPresentation').that.is.a('string');
    expect(variables).to.have.property('hello').that.is.a('string');
    expect(variables).to.have.property('context').that.is.a('string');
    expect(variables).to.have.property('disclaimer').that.is.a('string');
    expect(variables).to.have.property('warningMessage').that.is.a('string');
    expect(variables).to.have.property('resetMyPassword').that.is.a('string');
    expect(variables).to.have.property('supportContact').that.is.a('string');
    expect(variables).to.have.property('helpDeskUrl').that.is.a('string');
    expect(variables).to.have.property('resetUrl').that.is.a('string');
    expect(variables).to.have.property('thanks').that.is.a('string');
    expect(variables).to.have.property('signing').that.is.a('string');
  });

  describe('when the locale is en', function () {
    it('provides the correct reset password URL', function () {
      // given
      const emailParams = {
        email: 'toto@example.net',
        locale: 'en',
        firstName: 'John',
      };

      // when
      const email = createWarningConnectionEmail(emailParams);

      // then
      const resetUrl = email.variables.resetUrl;
      expect(resetUrl).to.equal('https://test.app.pix.org/mot-de-passe-oublie?lang=en');
    });
  });

  describe('when the locale is fr-fr', function () {
    it('provides the correct reset password URL', function () {
      // given
      const emailParams = {
        email: 'toto@example.net',
        locale: 'fr-fr',
        firstName: 'John',
      };

      // when
      const email = createWarningConnectionEmail(emailParams);

      // then
      const resetUrl = email.variables.resetUrl;
      expect(resetUrl).to.equal('https://test.app.pix.fr/mot-de-passe-oublie?lang=fr');
    });
  });

  describe('when the locale is nl-BE', function () {
    it('provides the correct reset password URL', function () {
      // given
      const emailParams = {
        email: 'toto@example.net',
        locale: 'nl-BE',
        firstName: 'John',
      };

      // when
      const email = createWarningConnectionEmail(emailParams);

      // then
      const resetUrl = email.variables.resetUrl;
      expect(resetUrl).to.equal('https://test.app.pix.org/mot-de-passe-oublie?lang=nl');
    });
  });
});
