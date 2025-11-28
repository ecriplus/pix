export class LengthPrefixedJsonDecoderStream extends TransformStream {
  constructor() {
    super({
      async transform(chunk, controller) {
        const objects = findObjects(chunk);
        for (const object of objects) {
          controller.enqueue(object);
        }
      },
    });
  }
}

function findObjects(str) {
  const objects = [];
  while (str.length > 0) {
    const [numberAsStr, ...otherParts] = str.split(':');
    const objectLength = parseInt(numberAsStr);
    const strLeft = otherParts.join(':');
    objects.push(strLeft.slice(0, objectLength));
    str = strLeft.slice(objectLength);
  }

  return objects.map((obj) => JSON.parse(obj));
}
