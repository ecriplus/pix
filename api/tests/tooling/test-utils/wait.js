import { setTimeout } from 'node:timers/promises';

export function wait(ms) {
  return setTimeout(ms);
}

export function waitForStreamFinalizationToBeDone() {
  return wait(50);
}
