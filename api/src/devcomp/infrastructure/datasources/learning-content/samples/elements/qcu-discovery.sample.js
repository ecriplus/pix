import { randomUUID } from 'node:crypto';

export function getQCUDiscoverySample(nbOfProposals = 4) {
  return {
    id: randomUUID(),
    type: 'qcu-discovery',
    instruction: '<p>Une question découverte ?</p>',
    proposals: Array.from(Array(nbOfProposals)).map((_, i) => ({
      id: `${i + 1}`,
      content: `Proposition ${i + 1}`,
      feedback: { diagnosis: `<p> Diagnostic ${i + 1}</p>` },
    })),
    solution: '1',
  };
}
