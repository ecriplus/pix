import * as serializer from '../../../../../../../src/prescription/organization-learner/infrastructure/serializers/jsonapi/analysis-by-tubes-serializer.js';
import { expect } from '../../../../../../test-helper.js';

describe('Unit | Serializer | JSONAPI | analysis-by-tubes-serializer', function () {
  describe('#serialize', function () {
    it('should convert an analysis-by-tubes object into JSON API data', function () {
      // given
      const analysisByTubes = { data: [{}] };
      const expectedType = 'analysis-by-tubes';
      const expectedData = analysisByTubes.data;

      // when
      const json = serializer.serialize(analysisByTubes);

      // then
      expect(json.data.type).to.equal(expectedType);
      expect(json.data.attributes.data).to.deep.equal(expectedData);
      expect(json.data.id).to.exist;
    });
  });
});
