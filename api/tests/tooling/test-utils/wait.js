export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function waitForStreamFinalizationToBeDone() {
  return wait(300);
}
