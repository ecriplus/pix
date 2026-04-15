export function catchErr(promiseFn, ctx) {
  return async (...args) => {
    try {
      await promiseFn.call(ctx, ...args);
    } catch (err) {
      return err;
    }
    throw new Error('Expected an error, but none was thrown.');
  };
}

export function catchErrSync(fn, ctx) {
  return (...args) => {
    try {
      fn.call(ctx, ...args);
    } catch (err) {
      return err;
    }
    throw new Error('Expected an error, but none was thrown.');
  };
}

export const preventStubsToBeCalledUnexpectedly = (stubs) => {
  for (const stub of stubs) {
    stub.rejects(
      new Error(
        `Unexpected call to stub "${stub.toString()}" (whether because it should not have been called OR called with wrong arguments)`,
      ),
    );
  }
};
