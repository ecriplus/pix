import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer, Deserializer } = jsonapiSerializer;

const serialize = function (invitations) {
  return new Serializer('organization-invitations', {
    attributes: ['organizationId', 'organizationName', 'email', 'status', 'updatedAt', 'role', 'locale'],
  }).serialize(invitations);
};

const deserializeForCreateOrganizationInvitationAndSendEmail = function (payload) {
  return new Deserializer().deserialize(payload).then((record) => {
    return {
      role: record.role,
      locale: record.locale,
      email: record.email?.trim().toLowerCase(),
    };
  });
};
export const organizationInvitationSerializer = { deserializeForCreateOrganizationInvitationAndSendEmail, serialize };
