import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { Feature } from '../../domain/models/Feature.js';

const getFeatureByKey = async function (key) {
  const knexConn = DomainTransaction.getConnection();
  const feature = await knexConn('features').where({ key }).first();

  if (!feature) {
    throw new NotFoundError(`La feature avec la clé '${key}' n'existe pas.`);
  }
  return new Feature(feature);
};

const findAll = async function () {
  const knexConn = DomainTransaction.getConnection();
  const features = await knexConn('features').select('*');

  return features.map((feature) => new Feature(feature));
};

export { findAll, getFeatureByKey };
