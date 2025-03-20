import { expect } from 'chai';

import { meshConfiguration } from '../../../../../../../src/certification/results/domain/models/v3/MeshConfiguration.js';

describe('Unit | Domain | Models | MeshConfiguration', function () {
  describe('#findIntervalIndexFromScore', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        score: 0,
        expectedInterval: 0,
      },
      {
        score: 64,
        expectedInterval: 1,
      },
      {
        score: 200,
        expectedInterval: 2,
      },
      {
        score: 896,
        expectedInterval: 7,
      },
    ].forEach(({ score, expectedInterval }) => {
      it(`returns the interval ${expectedInterval} when score is ${score}`, function () {
        // when
        const result = meshConfiguration.findIntervalIndexFromScore({
          score,
        });

        // then
        expect(result).to.equal(expectedInterval);
      });
    });
  });
});
