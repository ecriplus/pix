import { isEmpty } from '@ember/utils';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { decodeToken } from 'mon-pix/helpers/jwt';

export default class GarAuthenticator extends BaseAuthenticator {
  authenticate(token, tokenDecoder = decodeToken) {
    const token_type = 'bearer';
    const { user_id, source } = tokenDecoder(token);
    return Promise.resolve({
      token_type,
      access_token: token,
      user_id,
      source,
    });
  }

  restore(data) {
    return new Promise((resolve, reject) => {
      if (!isEmpty(data['access_token'])) {
        resolve(data);
      }
      reject();
    });
  }
}
