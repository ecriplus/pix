import { expect } from 'chai';

import { meshConfiguration } from '../../../../../../../src/certification/results/domain/models/v3/MeshConfiguration.js';

describe('Unit | Domain | Models | MeshConfiguration', function () {
  describe('#findMeshFromScore', function () {
    [
      {
        score: 0,
        meshKey: 'LEVEL_PRE_BEGINNER',

        expectedInterval: meshConfiguration.getMesh('LEVEL_PRE_BEGINNER'),
      },
      {
        score: 64,
        meshKey: 'LEVEL_BEGINNER_1',

        expectedInterval: meshConfiguration.getMesh('LEVEL_BEGINNER_1'),
      },
      {
        score: 200,
        meshKey: 'LEVEL_BEGINNER_2',

        expectedInterval: meshConfiguration.getMesh('LEVEL_BEGINNER_2'),
      },
      {
        score: 896,
        meshKey: 'LEVEL_EXPERT_7',

        expectedInterval: meshConfiguration.getMesh('LEVEL_EXPERT_7'),
      },
    ].forEach(({ score, meshKey, expectedInterval }) => {
      it(`returns the interval ${expectedInterval} of key ${meshKey} when score is ${score}`, function () {
        // when
        const result = meshConfiguration.findMeshFromScore({
          score,
        });

        // then
        expect(result.key).to.equal(meshKey);
        expect(result.value).to.equal(expectedInterval);
      });
    });
  });

  describe('#findIntervalIndexFromScore', function () {
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
