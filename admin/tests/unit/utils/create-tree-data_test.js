import { setupTest } from 'ember-qunit';
import {
  createMermaidFlowchart,
  createRelationsFromPath,
  createTreeFromData,
  minifyTree,
  sortTree,
} from 'pix-admin/utils/create-tree-data.js';
import { module, test } from 'qunit';

module('Unit | Utils | create tree data', function () {
  module('#createRelationsFromPath', function (hooks) {
    setupTest(hooks);

    test('should create relation list from a single path', async function (assert) {
      const tree = createRelationsFromPath('1-VALIDATION > 1-TRAINING > 1-VALIDATION > 1-TUTORIAL > 1-TRAINING');
      assert.deepEqual(tree, [
        {
          from: '1-VALIDATION > 1-TRAINING > 1-VALIDATION > 1-TUTORIAL',
          to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION > 1-TUTORIAL > 1-TRAINING',
        },
        {
          from: '1-VALIDATION > 1-TRAINING > 1-VALIDATION',
          to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION > 1-TUTORIAL',
        },
        {
          from: '1-VALIDATION > 1-TRAINING',
          to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION',
        },
        {
          from: '1-VALIDATION',
          to: '1-VALIDATION > 1-TRAINING',
        },
      ]);
    });
  });

  module('#createTreeFromData', function () {
    test('should create tree from json data', async function (assert) {
      const data = [
        { fullPath: '1-VALIDATION > 1-TRAINING > 1-VALIDATION', nombre: '5' },
        { fullPath: '1-VALIDATION > 2-VALIDATION', nombre: '10' },
      ];
      const tree = createTreeFromData(data);
      assert.deepEqual(tree.relations, [
        { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION', number: '5' },
        { from: '1-VALIDATION', to: '1-VALIDATION > 1-TRAINING', number: '5' },
        { from: '1-VALIDATION', to: '1-VALIDATION > 2-VALIDATION', number: '10' },
      ]);
      assert.deepEqual(tree.nodes, [
        { id: '1-VALIDATION > 1-TRAINING' },
        { id: '1-VALIDATION > 1-TRAINING > 1-VALIDATION' },
        { id: '1-VALIDATION' },
        { id: '1-VALIDATION > 2-VALIDATION' },
      ]);
    });

    test('should gather same relations and add up numbers', async function (assert) {
      const data = [
        { fullPath: '1-VALIDATION > 1-TRAINING > 1-VALIDATION', nombre: '5' },
        { fullPath: '1-VALIDATION > 1-TRAINING > 1-TUTORIAL', nombre: '10' },
      ];
      const tree = createTreeFromData(data);
      assert.deepEqual(tree.relations, [
        { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION', number: '5' },
        { from: '1-VALIDATION', to: '1-VALIDATION > 1-TRAINING', number: '15' },
        { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-TUTORIAL', number: '10' },
      ]);
    });
  });

  module('#sortTree', function () {
    test('should sort tree relations in order to have successes first', async function (assert) {
      const tree = {
        relations: [
          { from: '1-VALIDATION', to: '1-VALIDATION > 1-TRAINING' },
          { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-TUTORIAL' },
          { from: '1-VALIDATION', to: '1-VALIDATION > 2-VALIDATION' },
          { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION' },
        ],
        nodes: [
          { id: '1-VALIDATION > 1-TRAINING' },
          { id: '1-VALIDATION > 1-TRAINING > STARTED' },
          { id: '1-VALIDATION' },
          { id: '1-VALIDATION > 2-VALIDATION' },
        ],
      };

      const sortedTree = sortTree(tree);
      assert.deepEqual(sortedTree.relations, [
        { from: '1-VALIDATION', to: '1-VALIDATION > 2-VALIDATION' },
        { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION' },
        { from: '1-VALIDATION', to: '1-VALIDATION > 1-TRAINING' },
        { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-TUTORIAL' },
      ]);
      assert.deepEqual(sortedTree.nodes, [
        { id: '1-VALIDATION > 2-VALIDATION' },
        { id: '1-VALIDATION' },
        { id: '1-VALIDATION > 1-TRAINING' },
        { id: '1-VALIDATION > 1-TRAINING > STARTED' },
      ]);
    });
  });
  module('#minifyTree', function () {
    test('should create tree with short node ids and meaningfull labels', async function (assert) {
      const tree = {
        relations: [
          { from: '1-VALIDATION', to: '1-VALIDATION > 1-TRAINING', number: '5' },
          { from: '1-VALIDATION > 1-TRAINING', to: '1-VALIDATION > 1-TRAINING > 1-VALIDATION', number: '5' },
          { from: '1-VALIDATION', to: '1-VALIDATION > 2-VALIDATION', number: '10' },
        ],
        nodes: [
          { id: '1-VALIDATION' },
          { id: '1-VALIDATION > 1-TRAINING' },
          { id: '1-VALIDATION > 1-TRAINING > 1-VALIDATION' },
          { id: '1-VALIDATION > 2-VALIDATION' },
        ],
      };

      const minifiedTree = minifyTree(tree);
      assert.deepEqual(minifiedTree.relations, [
        { from: 0, to: 1, number: '5' },
        { from: 1, to: 2, number: '5' },
        { from: 0, to: 3, number: '10' },
      ]);
      assert.deepEqual(Array.from(minifiedTree.nodeLabelsById), [
        [0, '1-VALIDATION'],
        [1, '1-TRAINING'],
        [2, '1-VALIDATION'],
        [3, '2-VALIDATION'],
      ]);
    });
  });

  module('#createMermaidFlowchart', function () {
    test('should create mermaid Flowchart from tree', async function (assert) {
      const tree = {
        relations: [
          { from: 0, to: 1, number: '5' },
          { from: 1, to: 2, number: '5' },
          { from: 0, to: 3, number: '10' },
        ],
        nodeLabelsById: new Map([
          [0, '1-VALIDATION'],
          [1, '1-TRAINING'],
          [2, '1-VALIDATION'],
          [3, '2-VALIDATION'],
        ]),
      };
      const mermaidFlowchart = createMermaidFlowchart(tree);
      assert.strictEqual(
        mermaidFlowchart,
        `flowchart LR
0[1-VALIDATION] -->|5| 1[1-TRAINING]
1[1-TRAINING] -->|5| 2[1-VALIDATION]
0[1-VALIDATION] -->|10| 3[2-VALIDATION]
style 0 stroke:#3d68ff,stroke-width:4px
style 1 stroke:#3d68ff,stroke-width:4px
style 2 stroke:#3d68ff,stroke-width:4px
style 3 stroke:#52d987,stroke-width:4px`,
      );
    });
    test('should shape final states with rounded rectangles', async function (assert) {
      const tree = {
        relations: [
          { from: 0, to: 1, number: '5' },
          { from: 1, to: 2, number: '5' },
        ],
        nodeLabelsById: new Map([
          [0, '1-VALIDATION'],
          [1, '1-TRAINING'],
          [2, 'FAILED'],
        ]),
      };
      const mermaidFlowchart = createMermaidFlowchart(tree);
      assert.strictEqual(
        mermaidFlowchart,
        `flowchart LR
0[1-VALIDATION] -->|5| 1[1-TRAINING]
1[1-TRAINING] -->|5| 2(FAILED)
style 0 stroke:#3d68ff,stroke-width:4px
style 1 stroke:#3d68ff,stroke-width:4px
style 2 fill:#f1c4c4`,
      );
    });
  });
});
