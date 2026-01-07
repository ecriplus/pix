import ApplicationSerializer from './application';
export default class CombinedCourseBlueprintSerializer extends ApplicationSerializer {
  serialize() {
    const json = super.serialize(...arguments);
    json.data.attributes.content = json.data.attributes.content.map(({ type, value }) => ({ type, value }));
    return json;
  }
}
