const ComplementaryCertificationCourseResultsForJuryCertificationWithExternal = require('../../../../lib/domain/read-models/ComplementaryCertificationCourseResultsForJuryCertificationWithExternal');
const { PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE, PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT } =
  require('../../../../lib/domain/models/Badge').keys;

module.exports = function buildPixEduComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
  complementaryCertificationCourseId = 456,
  pixPartnerKey = PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  pixLabel = 'Pix+ Édu 1er degré Avancé',
  pixAcquired = true,
  pixLevel = 2,
  externalPartnerKey = PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
  externalLabel = 'Pix+ Édu 1er degré Expert',
  externalAcquired = true,
  externalLevel = 1,
  allowedExternalLevels = [],
} = {}) {
  return new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
    complementaryCertificationCourseId,
    pixPartnerKey,
    pixLabel,
    pixAcquired,
    pixLevel,
    externalPartnerKey,
    externalLabel,
    externalAcquired,
    externalLevel,
    allowedExternalLevels,
  });
};
