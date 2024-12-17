import { sessionController } from '../../../../lib/application/sessions/session-controller.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Controller | sessionController', function () {
  const userId = 274939274;

  describe('#getJuryCertificationSummaries ', function () {
    it('should return jury certification summaries', async function () {
      // given
      const sessionId = 1;
      const juryCertificationSummaries = { juryCertificationSummaries: 'tactac', pagination: {} };
      const juryCertificationSummariesJSONAPI = 'someSummariesJSONApi';
      const page = { number: 3, size: 30 };
      const pagination = Symbol('pagination');

      const request = {
        params: { id: sessionId },
        query: { page: { size: 30, number: 3 } },
        auth: {
          credentials: {
            userId,
          },
        },
      };
      const juryCertificationSummaryRepository = {
        findBySessionIdPaginated: sinon.stub(),
      };
      juryCertificationSummaryRepository.findBySessionIdPaginated
        .withArgs({ sessionId, page })
        .resolves({ juryCertificationSummaries, pagination });
      const juryCertificationSummarySerializer = {
        serialize: sinon.stub(),
      };
      juryCertificationSummarySerializer.serialize
        .withArgs(juryCertificationSummaries)
        .returns(juryCertificationSummariesJSONAPI);

      // when
      const response = await sessionController.getJuryCertificationSummaries(request, hFake, {
        juryCertificationSummaryRepository,
        juryCertificationSummarySerializer,
      });

      // then
      expect(response).to.deep.equal(juryCertificationSummariesJSONAPI);
    });
  });
});
