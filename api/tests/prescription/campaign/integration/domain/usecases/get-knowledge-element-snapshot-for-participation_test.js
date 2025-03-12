import { usecases } from '../../../../../../src/prescription/campaign/domain/usecases/index.js';
import { KnowledgeElement } from '../../../../../../src/shared/domain/models/KnowledgeElement.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | UseCase | get-knowledge-element-snapshot-for-participation', function () {
  it('should return null', async function () {
    const result = await usecases.getKnowledgeElementSnapshotForParticipation({
      campaignParticipationId: 1,
    });

    expect(result).to.be.null;
  });

  it('should return KnowledgeElementSnapshot', async function () {
    const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation().id;
    databaseBuilder.factory.buildKnowledgeElementSnapshot({ campaignParticipationId });
    await databaseBuilder.commit();

    const result = await usecases.getKnowledgeElementSnapshotForParticipation({
      campaignParticipationId,
    });

    expect(result).to.be.instanceOf(Array);
    expect(result[0]).to.be.instanceOf(KnowledgeElement);
  });
});
