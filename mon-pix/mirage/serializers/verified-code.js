import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: ['type'],
  include: ['campaign', 'combined-course'],
  links(verifiedCode) {
    return {
      campaign: {
        related: `/api/campaigns?filter[code]=${verifiedCode.id}`,
      },
      'combined-course': {
        related: `/api/combined-courses?filter[code]=${verifiedCode.id}`,
      },
    };
  },
});
