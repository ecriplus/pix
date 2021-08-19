const { expect, sinon, catchErr } = require('../../../test-helper');
const getJurySession = require('../../../../lib/domain/usecases/get-jury-session');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | get-jury-session', function() {

  const sessionId = 'sessionId';
  let jurySessionRepository;

  beforeEach(function() {
    jurySessionRepository = {
      get: sinon.stub(),
    };
  });

  context('when the session exists', function() {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const sessionToFind = Symbol('sessionToFind');

    beforeEach(function() {
      jurySessionRepository.get.withArgs(sessionId).resolves(sessionToFind);
    });

    it('should get the session', async function() {
      // when
      const actualSession = await getJurySession({ sessionId, jurySessionRepository });

      // then
      expect(actualSession).to.equal(sessionToFind);
    });
  });

  context('when the session does not exist', function() {

    beforeEach(function() {
      jurySessionRepository.get.withArgs(sessionId).rejects(new NotFoundError());
    });

    it('should throw an error the session', async function() {
      // when
      const err = await catchErr(getJurySession)({ sessionId, jurySessionRepository });

      // then
      expect(err).to.be.an.instanceof(NotFoundError);
    });
  });

});
