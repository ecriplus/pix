const RESULT_STATUSES = ['FAILED', 'STARTED', 'SUCCEEDED', 'SKIPPED'];

const COLORS = {
  FAILED: '#f1c4c4',
  SUCCEEDED: '#b9d8cd',
  SKIPPED: '#ffe5c0',
  STARTED: '#f4f5f7',
};

const NODE_ORDER = [
  'STARTED',
  'SKIPPED',
  'FAILED',
  '1-TUTORIAL',
  '1-TRAINING',
  '1-VALIDATION',
  '2-TUTORIAL',
  '2-TRAINING',
  '2-VALIDATION',
  'SUCCEEDED',
  '-CHALLENGE',
];

import { fromUint8Array } from 'js-base64';
import { deflate } from 'pako';

const formatJSON = (data) => JSON.stringify(data, undefined, 2);
const serialize = (state) => {
  const data = new TextEncoder().encode(state);
  const compressed = deflate(data, { level: 9 }); // zlib level 9
  return fromUint8Array(compressed, true); // url safe base64 encoding
};

function createTreeFromData(data) {
  const relations = data.flatMap((pathWithNumber) =>
    createRelationsFromPath(pathWithNumber.fullPath).map((path) => {
      return { ...path, number: pathWithNumber.nombre };
    }),
  );
  const uniqueRelations = [];

  relations.forEach((relation) => {
    const uniqueRelation = uniqueRelations.filter((uniqueRelation) => uniqueRelation.to === relation.to)?.[0];
    if (uniqueRelation) {
      uniqueRelation.number = new String(Number(uniqueRelation.number) + Number(relation.number));
    } else {
      uniqueRelations.push(relation);
    }
  });

  const nodes = [...new Set(uniqueRelations.flatMap((relation) => [relation.from, relation.to]))].map((nodeId) => {
    return { id: nodeId };
  });
  return { relations: uniqueRelations, nodes };
}

function createRelationsFromPath(path) {
  const nodeMatcher = new RegExp('(?<node1>.*)\\s\\>\\s(?<node2>.*)');
  let matched = nodeMatcher.exec(path);
  const relations = [];
  while (matched) {
    relations.push({ from: matched.groups.node1, to: `${matched.groups.node1} > ${matched.groups.node2}` });
    matched = nodeMatcher.exec(matched.groups.node1);
  }
  return relations;
}

function sortTree(tree) {
  return {
    relations: tree.relations.sort((relation1, relation2) => {
      return lastWordValue(relation2.to) - lastWordValue(relation1.to);
    }),
    nodes: tree.nodes.sort((node1, node2) => {
      return lastWordValue(node2.id) - lastWordValue(node1.id);
    }),
  };
}

function lastWordValue(path) {
  return NODE_ORDER.findIndex((nodeLabel) => nodeLabel === lastWord(path));
}

function lastWord(path) {
  return path.split(' ').slice(-1)[0];
}

function minifyTree(tree) {
  const nodesMinifiedNamesByPath = new Map(Array.from(tree.nodes, (node, i) => [node.id, i]));
  const nodeLabelsById = new Map(
    Array.from(nodesMinifiedNamesByPath.entries()).map(([path, minifiedName]) => [minifiedName, lastWord(path)]),
  );
  return {
    nodeLabelsById,
    relations: tree.relations.map((relation) => {
      return {
        from: nodesMinifiedNamesByPath.get(relation.from),
        to: nodesMinifiedNamesByPath.get(relation.to),
        number: relation.number,
      };
    }),
  };
}

function applyBoxStyle([id, label]) {
  const nodeColor = COLORS[label];
  if (nodeColor) {
    return `style ${id} fill:${nodeColor}`;
  }
  const stepNumber = label.charAt(0);
  if (stepNumber === '0') {
    return `style ${id} stroke:#ff3f94,stroke-width:4px`;
  } else if (stepNumber === '1') {
    return `style ${id} stroke:#3d68ff,stroke-width:4px`;
  } else if (stepNumber === '-') {
    return `style ${id} stroke:#ac008d,stroke-width:4px`;
  }
  return `style ${id} stroke:#52d987,stroke-width:4px`;
}

function applyMermaidStyle(tree) {
  return Array.from(tree.nodeLabelsById.entries(), applyBoxStyle).join('\n');
}

function createMermaidFlowchart(tree) {
  return (
    'flowchart LR\n' +
    tree.relations
      .map((relation) => {
        const fromLabel = tree.nodeLabelsById.get(relation.from);
        const toLabel = tree.nodeLabelsById.get(relation.to);
        const finalNode = RESULT_STATUSES.includes(toLabel) ? `(${toLabel})` : `[${toLabel}]`;
        return `${relation.from}[${fromLabel}] -->|${relation.number}| ${relation.to}${finalNode}`;
      })
      .join('\n')
  );
}

function createMermaidFlowchartLink(data) {
  const rawTree = createTreeFromData(data);
  const sortedTree = sortTree(rawTree);
  const minifiedTree = minifyTree(sortedTree);

  const flowChart = createMermaidFlowchart(minifiedTree);
  const flowChartStyle = applyMermaidStyle(minifiedTree);

  const defaultState = {
    code: flowChart + '\n' + flowChartStyle,
    mermaid: formatJSON({
      theme: 'default',
    }),
    autoSync: true,
    updateDiagram: true,
  };

  const json = JSON.stringify(defaultState);
  const serialized = serialize(json);
  return `https://mermaid.live/edit#pako:${serialized}`;
}

export {
  applyMermaidStyle,
  createMermaidFlowchart,
  createMermaidFlowchartLink,
  createRelationsFromPath,
  createTreeFromData,
  minifyTree,
  sortTree,
};
