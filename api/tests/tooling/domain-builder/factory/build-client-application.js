import { ClientApplication } from '../../../../src/identity-access-management/domain/models/ClientApplication.js';

export function buildClientApplication({
  id = 123,
  name = 'clientApplication',
  clientId = 'client-id',
  clientSecret = 'super-secret',
  scopes = ['scope1', 'scope2'],
  jurisdiction = [
    {
      rule: 'tags',
      value: ['MEDNUM'],
    },
  ],
} = {}) {
  return new ClientApplication({ id, name, clientId, clientSecret, scopes, jurisdiction });
}
