import { OrganizationFeature } from '../../../../../src/organizational-entities/domain/models/OrganizationFeature.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Organizational Entities | Domain | Model | OrganizationFeature', function () {
  let organizationFeature, featureId, organizationId, params;

  beforeEach(function () {
    // given
    featureId = '1';
    organizationId = '2';
    params = `{"id": 3}`;
  });

  describe('#constructor', function () {
    it('should initialize an instance with given params', function () {
      //when
      organizationFeature = new OrganizationFeature({ featureId, organizationId, params });
      // then
      expect(organizationFeature).to.deep.equal({
        featureId: 1,
        organizationId: 2,
        params: { id: 3 },
      });
    });
  });

  describe('#deleteLearner', function () {
    it('should activate learner deletion given params', function () {
      //when
      organizationFeature = new OrganizationFeature({ featureId, organizationId, params, deleteLearner: 'Y' });
      // then
      expect(organizationFeature.deleteLearner).to.be.true;
    });

    it('should deactivate learner deletion given params', function () {
      //when
      organizationFeature = new OrganizationFeature({ featureId, organizationId, params });
      // then
      expect(organizationFeature.deleteLearner).to.be.false;
    });
  });
});
