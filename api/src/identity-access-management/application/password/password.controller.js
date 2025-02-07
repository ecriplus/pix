import * as userSerializer from '../../../shared/infrastructure/serializers/jsonapi/user-serializer.js';
import { extractLocaleFromRequest } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';
import * as resetPasswordSerializer from '../../infrastructure/serializers/jsonapi/reset-password.serializer.js';

const checkResetDemand = async function (request, h, dependencies = { userSerializer }) {
  const temporaryKey = request.params.temporaryKey;
  const user = await usecases.getUserByResetPasswordDemand({ temporaryKey });
  return dependencies.userSerializer.serialize(user);
};
const createResetPasswordDemand = async function (request, h, dependencies = { resetPasswordSerializer }) {
  const email = request.payload.email;
  const locale = extractLocaleFromRequest(request);

  const resetPasswordDemand = await usecases.createResetPasswordDemand({
    email,
    locale,
  });
  const serializedPayload = dependencies.resetPasswordSerializer.serialize(resetPasswordDemand);

  return h.response(serializedPayload).created();
};

const updateExpiredPassword = async function (request, h) {
  const passwordResetToken = request.payload.data.attributes['password-reset-token'];
  const newPassword = request.payload.data.attributes['new-password'];
  const login = await usecases.updateExpiredPassword({ passwordResetToken, newPassword });

  return h
    .response({
      data: {
        type: 'reset-expired-password-demands',
        attributes: {
          login,
        },
      },
    })
    .created();
};

export const passwordController = { checkResetDemand, createResetPasswordDemand, updateExpiredPassword };
