import { Counter, Gauge, Histogram, Summary } from 'prom-client';

import { config } from '../../config.js';
import { register } from './register.js';

/**
 * @param {Omit<ConstructorParameters<typeof Counter>[0], "registers">} configuration
 */
export function createCounter({ name, ...configuration }) {
  return new Counter({
    ...configuration,
    name: `${config.metrics.prometheus.prefix}_${name}`,
    registers: [register],
  });
}

/**
 * @param {Omit<ConstructorParameters<typeof Gauge>[0], "registers">} configuration
 */
export function createGauge({ name, ...configuration }) {
  return new Gauge({
    ...configuration,
    name: `${config.metrics.prometheus.prefix}_${name}`,
    registers: [register],
  });
}

/**
 * @param {Omit<ConstructorParameters<typeof Histogram>[0], "registers">} configuration
 */
export function createHistogram({ name, ...configuration }) {
  return new Histogram({
    ...configuration,
    name: `${config.metrics.prometheus.prefix}_${name}`,
    registers: [register],
  });
}

/**
 * @param {Omit<ConstructorParameters<typeof Summary>[0], "registers">} configuration
 */
export function createSummary({ name, ...configuration }) {
  return new Summary({
    ...configuration,
    name: `${config.metrics.prometheus.prefix}_${name}`,
    registers: [register],
  });
}
