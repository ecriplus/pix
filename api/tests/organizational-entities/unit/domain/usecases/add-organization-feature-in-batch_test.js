import { FeatureParamsNotProcessable } from '../../../../../src/organizational-entities/domain/errors.js';
import { OrganizationFeature } from '../../../../../src/organizational-entities/domain/models/OrganizationFeature.js';
import { addOrganizationFeatureInBatch } from '../../../../../src/organizational-entities/domain/usecases/add-organization-feature-in-batch.js';
import { DomainTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { catchErr, createTempFile, expect, removeTempFile, sinon } from '../../../../test-helper.js';

describe('Unit | Domain | UseCases | add-organization-feature-in-batch', function () {
  let organizationFeatureRepository, learnersApi, featureId, filePath, csvData, userId;

  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });
    userId = Symbol('userId');
    featureId = 1;
    csvData = [
      new OrganizationFeature({ featureId, organizationId: 123, params: `{ "id": 123 }` }),
      new OrganizationFeature({ featureId, organizationId: 456, params: `{ "id": 123 }` }),
    ];

    learnersApi = { deleteOrganizationLearnerBeforeImportFeature: sinon.stub() };
    organizationFeatureRepository = {
      saveInBatch: sinon.stub(),
    };
  });

  afterEach(async function () {
    await removeTempFile(filePath);
  });

  it('should call saveInBatch with correct paramaters', async function () {
    // given
    filePath = await createTempFile(
      'test.csv',
      `Feature ID;Organization ID;Params
    ${featureId};123;{"id": 123}
    ${featureId};456;{"id": 123}
`,
    );
    // when
    await addOrganizationFeatureInBatch({ filePath, organizationFeatureRepository, learnersApi });

    expect(organizationFeatureRepository.saveInBatch).to.have.been.calledOnceWithExactly(csvData);
    expect(learnersApi.deleteOrganizationLearnerBeforeImportFeature.called).to.be.false;
  });

  it('should call call learner api with correct paramaters', async function () {
    // given
    filePath = await createTempFile(
      'test.csv',
      `Feature ID;Organization ID;Params;Delete Learner
    ${featureId};123;{"id": 123};
    ${featureId};456;{"id": 123};Y
`,
    );
    // when
    await addOrganizationFeatureInBatch({ userId, filePath, organizationFeatureRepository, learnersApi });

    expect(organizationFeatureRepository.saveInBatch).to.have.been.calledOnceWithExactly(csvData);
    expect(learnersApi.deleteOrganizationLearnerBeforeImportFeature).to.have.been.calledOnceWithExactly({
      userId,
      organizationId: 456,
    });
  });

  it('should throw a FeatureParamsNotProcessable error', async function () {
    // given
    filePath = await createTempFile(
      'test.csv',
      `Feature ID;Organization ID;Params
    ${featureId};123;{`,
    );

    // when
    const error = await catchErr(addOrganizationFeatureInBatch)({
      filePath,
      organizationFeatureRepository,
    });

    expect(error).to.be.instanceOf(FeatureParamsNotProcessable);
  });
});
