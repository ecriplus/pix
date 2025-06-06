import * as moduleUnderTest from '../../../../lib/application/sco-organization-learners/index.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import { securityPreHandlers } from '../../../../src/shared/application/security-pre-handlers.js';
import { UserNotAuthorizedToGenerateUsernamePasswordError } from '../../../../src/shared/domain/errors.js';
import { domainBuilder, expect, HttpTestServer, sinon } from '../../../test-helper.js';

describe('Integration | Application | sco-organization-learners | sco-organization-learner-controller', function () {
  let sandbox;
  let httpTestServer;

  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(usecases, 'generateUsernameWithTemporaryPassword').rejects(new Error('not expected error'));
    sandbox.stub(securityPreHandlers, 'checkUserBelongsToScoOrganizationAndManagesStudents');
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#generateUsernameWithTemporaryPassword', function () {
    const payload = { data: { attributes: {} } };
    const auth = { credentials: {}, strategy: {} };
    const generatedPassword = 'Passw0rd';
    const username = 'john.harry0207';

    beforeEach(function () {
      securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request, h) =>
        h.response(true),
      );
      payload.data.attributes = {
        'organization-learner-id': 1,
        'organization-id': 3,
      };
      auth.credentials.userId = domainBuilder.buildUser().id;
    });

    context('Success cases', function () {
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.generateUsernameWithTemporaryPassword.resolves({ username, generatedPassword });

        // when
        const response = await httpTestServer.request(
          'POST',
          '/api/sco-organization-learners/username-password-generation',
          payload,
          auth,
        );

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['username']).to.equal(username);
        expect(response.result.data.attributes['generated-password']).to.equal(generatedPassword);
      });
    });

    context('Error cases', function () {
      context('when the student has not access to the organization an error is thrown', function () {
        it('should resolve a 403 HTTP response', async function () {
          // given
          usecases.generateUsernameWithTemporaryPassword.rejects(
            new UserNotAuthorizedToGenerateUsernamePasswordError(),
          );

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/sco-organization-learners/username-password-generation',
            payload,
            auth,
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });
});
