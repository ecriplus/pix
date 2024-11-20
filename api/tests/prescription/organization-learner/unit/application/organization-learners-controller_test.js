import { organizationLearnersController } from '../../../../../src/prescription/organization-learner/application/organization-learners-controller.js';
import { usecases } from '../../../../../src/prescription/organization-learner/domain/usecases/index.js';
import { NoProfileRewardsFoundError } from '../../../../../src/profile/domain/errors.js';
import { catchErr, expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Application | Organization-Learner | organization-learners-controller', function () {
  describe('#getAttestationZipForDivisions', function () {
    describe('success case', function () {
      it('should return buffer', async function () {
        // given
        const organizationId = 123;
        const attestationKey = Symbol('attestationKey');
        const divisions = Symbol('divisions');
        const expectedBuffer = Symbol('buffer');

        sinon.stub(usecases, 'getAttestationZipForDivisions');

        usecases.getAttestationZipForDivisions
          .withArgs({ organizationId, attestationKey, divisions })
          .resolves(expectedBuffer);

        const request = {
          params: {
            organizationId,
            attestationKey,
          },
          query: {
            divisions,
          },
        };

        // when
        const response = await organizationLearnersController.getAttestationZipForDivisions(request, hFake);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    describe('errors case', function () {
      it('should return 204 if usecase return NoProfileRewardsFoundError', async function () {
        // given
        const organizationId = 123;
        const attestationKey = Symbol('attestationKey');
        const divisions = Symbol('divisions');

        sinon.stub(usecases, 'getAttestationZipForDivisions');

        usecases.getAttestationZipForDivisions
          .withArgs({ organizationId, attestationKey, divisions })
          .rejects(new NoProfileRewardsFoundError());

        const request = {
          params: {
            organizationId,
            attestationKey,
          },
          query: {
            divisions,
          },
        };

        // when
        const response = await organizationLearnersController.getAttestationZipForDivisions(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
      });

      it('should throw another error', async function () {
        // given
        const organizationId = 123;
        const attestationKey = Symbol('attestationKey');
        const divisions = Symbol('divisions');
        const expectedError = Symbol('error');
        sinon.stub(usecases, 'getAttestationZipForDivisions');

        usecases.getAttestationZipForDivisions
          .withArgs({ organizationId, attestationKey, divisions })
          .rejects(expectedError);

        const request = {
          params: {
            organizationId,
            attestationKey,
          },
          query: {
            divisions,
          },
        };

        // when
        const error = await catchErr(organizationLearnersController.getAttestationZipForDivisions)(request, hFake);

        // then
        expect(error).to.equal(expectedError);
      });
    });
  });
});
