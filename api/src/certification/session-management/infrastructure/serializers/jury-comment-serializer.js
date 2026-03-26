import jsonapiSerializer from 'jsonapi-serializer';

const { Deserializer } = jsonapiSerializer;

export async function deserialize(payload) {
  const dto = await new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(payload);
  if (dto.commentByJury) {
    return dto.commentByJury.trim();
  }
}
