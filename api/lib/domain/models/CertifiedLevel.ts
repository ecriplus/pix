// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UNCERTIFIE... Remove this comment to see the full error message
const { UNCERTIFIED_LEVEL } = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainErro... Remove this comment to see the full error message
const { DomainError } = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedL... Remove this comment to see the full error message
class CertifiedLevel {
  status: $TSFixMe;
  value: $TSFixMe;
  constructor({
    value,
    status
  }: $TSFixMe) {
    this.value = value;
    this.status = status;
  }

  static from({
    numberOfChallenges,
    numberOfNeutralizedAnswers,
    numberOfCorrectAnswers,
    estimatedLevel,
    reproducibilityRate
  }: $TSFixMe) {
    const rule = _rules.findRuleFor({
      numberOfChallenges,
      numberOfCorrectAnswers,
      numberOfNeutralizedAnswers,
    });
    if (!rule) {
      throw new MissingCertifiedLevelRuleError({
        numberOfChallenges,
        numberOfNeutralizedAnswers,
        numberOfCorrectAnswers,
      });
    } else {
      return rule.apply({ reproducibilityRate, estimatedLevel });
    }
  }

  static invalidate() {
    return new CertifiedLevel({ value: UNCERTIFIED_LEVEL, status: statuses.UNCERTIFIED });
  }

  static downgrade(estimatedLevel: $TSFixMe) {
    return new CertifiedLevel({ value: estimatedLevel - 1, status: statuses.DOWNGRADED });
  }

  static validate(estimatedLevel: $TSFixMe) {
    return new CertifiedLevel({ value: estimatedLevel, status: statuses.VALIDATED });
  }

  isDowngraded() {
    return this.status === statuses.DOWNGRADED;
  }

  isUncertified() {
    return this.status === statuses.UNCERTIFIED;
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  DOWNGRADED: 'DOWNGRADED',
  UNCERTIFIED: 'UNCERTIFIED',
  VALIDATED: 'VALIDATED',
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CertifiedLevel,
};

class Rule {
  actionWhenReproducibilityBelow70: $TSFixMe;
  actionWhenReproducibilityBetween70And80: $TSFixMe;
  actionWhenReproducibilityRateEqualOrAbove80: $TSFixMe;
  numberOfChallenges: $TSFixMe;
  numberOfCorrectAnswers: $TSFixMe;
  numberOfNeutralizedAnswers: $TSFixMe;
  constructor({
    numberOfChallenges,
    numberOfCorrectAnswers,
    numberOfNeutralizedAnswers,
    actionWhenReproducibilityRateEqualOrAbove80,
    actionWhenReproducibilityBetween70And80,
    actionWhenReproducibilityBelow70
  }: $TSFixMe) {
    this.numberOfChallenges = numberOfChallenges;
    this.numberOfCorrectAnswers = numberOfCorrectAnswers;
    this.numberOfNeutralizedAnswers = numberOfNeutralizedAnswers;
    this.actionWhenReproducibilityRateEqualOrAbove80 = actionWhenReproducibilityRateEqualOrAbove80;
    this.actionWhenReproducibilityBetween70And80 = actionWhenReproducibilityBetween70And80;
    this.actionWhenReproducibilityBelow70 = actionWhenReproducibilityBelow70;
  }

  isApplicable({
    numberOfChallenges,
    numberOfCorrectAnswers,
    numberOfNeutralizedAnswers
  }: $TSFixMe) {
    return (
      numberOfChallenges === this.numberOfChallenges &&
      numberOfCorrectAnswers === this.numberOfCorrectAnswers &&
      numberOfNeutralizedAnswers === this.numberOfNeutralizedAnswers
    );
  }

  apply({
    reproducibilityRate,
    estimatedLevel
  }: $TSFixMe) {
    if (reproducibilityRate >= 80) {
      return this.actionWhenReproducibilityRateEqualOrAbove80(estimatedLevel);
    } else if (reproducibilityRate >= 70) {
      return this.actionWhenReproducibilityBetween70And80(estimatedLevel);
    } else {
      return this.actionWhenReproducibilityBelow70(estimatedLevel);
    }
  }
}

class Rule1 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 3,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.validate,
      actionWhenReproducibilityBelow70: CertifiedLevel.validate,
    });
  }
}

class Rule2 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 2,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.downgrade,
      actionWhenReproducibilityBelow70: CertifiedLevel.downgrade,
    });
  }
}

class Rule3 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 2,
      numberOfNeutralizedAnswers: 1,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.validate,
      actionWhenReproducibilityBelow70: CertifiedLevel.validate,
    });
  }
}

class Rule4 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 1,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule5 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 1,
      numberOfNeutralizedAnswers: 1,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.downgrade,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule6 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 1,
      numberOfNeutralizedAnswers: 2,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.validate,
      actionWhenReproducibilityBelow70: CertifiedLevel.downgrade,
    });
  }
}

class Rule7 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule8 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 1,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule9 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 2,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule10 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 3,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 3,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule11 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 2,
      numberOfCorrectAnswers: 2,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.validate,
      actionWhenReproducibilityBelow70: CertifiedLevel.validate,
    });
  }
}

class Rule12 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 2,
      numberOfCorrectAnswers: 1,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.downgrade,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule13 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 2,
      numberOfCorrectAnswers: 1,
      numberOfNeutralizedAnswers: 1,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.validate,
      actionWhenReproducibilityBelow70: CertifiedLevel.downgrade,
    });
  }
}

class Rule14 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 2,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule15 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 2,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 1,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule16 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 2,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 2,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule17 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 1,
      numberOfCorrectAnswers: 1,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.validate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.validate,
      actionWhenReproducibilityBelow70: CertifiedLevel.downgrade,
    });
  }
}

class Rule18 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 1,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 1,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

class Rule19 extends Rule {
  constructor() {
    super({
      numberOfChallenges: 1,
      numberOfCorrectAnswers: 0,
      numberOfNeutralizedAnswers: 0,
      actionWhenReproducibilityRateEqualOrAbove80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBetween70And80: CertifiedLevel.invalidate,
      actionWhenReproducibilityBelow70: CertifiedLevel.invalidate,
    });
  }
}

const _rules = {
  rules: [
    new Rule1(),
    new Rule2(),
    new Rule3(),
    new Rule4(),
    new Rule5(),
    new Rule6(),
    new Rule7(),
    new Rule8(),
    new Rule9(),
    new Rule10(),
    new Rule11(),
    new Rule12(),
    new Rule13(),
    new Rule14(),
    new Rule15(),
    new Rule16(),
    new Rule17(),
    new Rule18(),
    new Rule19(),
  ],
  findRuleFor({
    numberOfChallenges,
    numberOfCorrectAnswers,
    numberOfNeutralizedAnswers
  }: $TSFixMe) {
    return this.rules.find((rule) =>
      rule.isApplicable({
        numberOfChallenges,
        numberOfCorrectAnswers,
        numberOfNeutralizedAnswers,
      })
    );
  },
};

class MissingCertifiedLevelRuleError extends DomainError {
  constructor({
    numberOfChallenges,
    numberOfCorrectAnswers,
    numberOfNeutralizedAnswers
  }: $TSFixMe) {
    const message =
      'Règle de calcul de niveau certifié manquante pour ' +
      `${numberOfChallenges} épreuves proposées ` +
      `${numberOfCorrectAnswers} réponses correctes et ` +
      `${numberOfNeutralizedAnswers} épreuves neutralisées`;
    super(message);
  }
}
