import { JSONAPISerializer } from 'miragejs';

const include = ['habilitations'];

export default JSONAPISerializer.extend({
  include,
  links(certificationCenter) {
    return {
      certificationCenterMemberships: {
        related: `/api/admin/certification-centers/${certificationCenter.id}/certification-center-memberships`,
      },
    };
  },
});
