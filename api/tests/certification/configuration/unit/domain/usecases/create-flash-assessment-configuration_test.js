import _ from 'lodash';

import { createFlashAssessmentConfiguration } from '../../../../../../src/certification/configuration/domain/usecases/create-flash-assessment-configuration.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Domain | UseCases | create-flash-assessment-configuration', function () {
  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });
  });

  it('should create an active flash assessment configuration', async function () {
    // given
    const flashAlgorithmConfigurationRepository = {
      save: sinon.stub(),
    };
    const sharedFlashAlgorithmConfigurationRepository = {
      getMostRecent: sinon.stub(),
    };

    const configuration = {
      enablePassageByAllCompetences: true,
    };

    const previousConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
      enablePassageByAllCompetences: false,
      variationPercent: 0.5,
    });

    sharedFlashAlgorithmConfigurationRepository.getMostRecent.resolves(previousConfiguration);

    // when
    await createFlashAssessmentConfiguration({
      flashAlgorithmConfigurationRepository,
      sharedFlashAlgorithmConfigurationRepository,
      configuration,
    });

    // then
    const expectedConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
      ...previousConfiguration,
      ...configuration,
    });

    expect(flashAlgorithmConfigurationRepository.save).to.have.been.calledWith(
      sinon.match(_.omit(expectedConfiguration, 'createdAt')),
    );
  });
});
