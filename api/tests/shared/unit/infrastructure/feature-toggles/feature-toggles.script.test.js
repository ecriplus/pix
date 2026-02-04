import { FeatureToggleScript } from '../../../../../src/shared/infrastructure/feature-toggles/feature-toggles-script.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Shared | Scripts | FeatureToggleScript', function () {
  let script;
  let featureTogglesClient;
  let logger;

  beforeEach(function () {
    script = new FeatureToggleScript();
    featureTogglesClient = {
      config: {},
      set: sinon.stub(),
      get: sinon.stub(),
    };
    logger = {
      warn: sinon.stub(),
    };
  });

  describe('#handle', function () {
    context('when featureToggle.type is boolean', function () {
      context('when the value is the string "true"', function () {
        it('sets boolean true in the featureTogglesClient', async function () {
          // given
          sinon.stub(featureTogglesClient, 'config').value({ aFeatureToggle: { type: 'boolean' } });
          const options = { key: 'aFeatureToggle', value: 'true' };

          // when
          await script.handle({ options, logger, featureTogglesClient });

          // then
          expect(featureTogglesClient.set).to.have.been.calledOnceWithExactly('aFeatureToggle', true);
        });
      });

      context('when the value is the string "false"', function () {
        it('sets boolean false in the featureTogglesClient', async function () {
          // given
          sinon.stub(featureTogglesClient, 'config').value({ aFeatureToggle: { type: 'boolean' } });
          const options = { key: 'aFeatureToggle', value: 'false' };

          // when
          await script.handle({ options, logger, featureTogglesClient });

          // then
          expect(featureTogglesClient.set).to.have.been.calledOnceWithExactly('aFeatureToggle', false);
        });
      });
    });

    context('when featureToggle.type is number', function () {
      it('sets an empty list in the featureTogglesClient', async function () {
        // given
        sinon.stub(featureTogglesClient, 'config').value({ aFeatureToggle: { type: 'number' } });
        const options = { key: 'aFeatureToggle', value: '98765' };

        // when
        await script.handle({ options, logger, featureTogglesClient });

        // then
        expect(featureTogglesClient.set).to.have.been.calledOnceWithExactly('aFeatureToggle', 98765);
      });
    });
  });
});
