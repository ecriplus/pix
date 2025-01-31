import ApplicationSerializer from './application';

export default class Organization extends ApplicationSerializer {
  serialize(snapshot) {
    const json = super.serialize(...arguments);

    json.data.attributes['first-name'] = snapshot.record.get('firstName');
    json.data.attributes['last-name'] = snapshot.record.get('lastName');
    json.data.attributes['email'] = snapshot.record.get('email');
    json.data.attributes['password'] = snapshot.record.get('password');
    return json;
  }
}
