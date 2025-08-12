import { flashAssessmentConfigurationController } from '../../../../../src/certification/configuration/application/flash-assessment-configuration-controller.js';
import { usecases } from '../../../../../src/certification/configuration/domain/usecases/index.js';
import { domainBuilder, expect, hFake, sinon } from '../../../../test-helper.js';

describe('Integration | Application | FlashAssessmentConfigurationController', function () {
  describe('#getActiveFlashAssessmentConfiguration', function () {
    it('should return the active flash assessment configuration', async function () {
      const expectedConfiguration = {
        data: {
          type: 'flash-algorithm-configurations',
          attributes: {
            'enable-passage-by-all-competences': true,
          },
        },
      };

      sinon.stub(usecases, 'getActiveFlashAssessmentConfiguration');
      const flashAlgorithmConfigurationSerializer = {
        serialize: sinon.stub(),
      };

      const flashAlgorithmConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
        enablePassageByAllCompetences: true,
      });

      usecases.getActiveFlashAssessmentConfiguration.resolves(flashAlgorithmConfiguration);
      flashAlgorithmConfigurationSerializer.serialize
        .withArgs({ flashAlgorithmConfiguration })
        .returns(expectedConfiguration);

      const response = await flashAssessmentConfigurationController.getActiveFlashAssessmentConfiguration({}, hFake, {
        flashAlgorithmConfigurationSerializer,
      });

      expect(response.statusCode).to.equal(200);
      expect(response.source).to.deep.equal(expectedConfiguration);
    });
  });

  describe('#createFlashAssessmentConfiguration', function () {
    it('should create an active flash assessment configuration', async function () {
      const flashAlgorithmConfigurationSerializer = {
        deserialize: sinon.stub(),
      };
      sinon.stub(usecases, 'createFlashAssessmentConfiguration');

      const payload = {
        enablePassageByAllCompetences: true,
      };
      const flashAlgorithmConfiguration = domainBuilder.buildFlashAlgorithmConfiguration(payload);
      flashAlgorithmConfigurationSerializer.deserialize.withArgs(payload).returns(flashAlgorithmConfiguration);

      const response = await flashAssessmentConfigurationController.createFlashAssessmentConfiguration(
        { payload },
        hFake,
      );

      expect(response.statusCode).to.equal(204);
      expect(usecases.createFlashAssessmentConfiguration).to.have.been.calledWith({
        configuration: flashAlgorithmConfiguration,
      });
    });
  });
});
