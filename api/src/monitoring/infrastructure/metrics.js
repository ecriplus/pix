import { logger } from '../../shared/infrastructure/utils/logger.js';
import metrics from 'datadog-metrics';

export class Metrics {

  static intervals = [];
  static metricDefinitions = [];

  constructor({ config }) {
    if (!config.featureToggles.isDirectMetricsEnabled) {
      logger.info('Metric initialisation : no reporter => no metrics sent');
      metrics.init({ reporter: metrics.NullReporter() });
    }

    if (config.featureToggles.isDirectMetricsEnabled) {
      logger.info('Metric initialisation : linked to Datadog');
      metrics.init({
        host: config.infra.containerName,
        prefix: '',
        flushIntervalSeconds: config.infra.metricsFlushIntervalSecond,
        defaultTags: [`service:${config.infra.appName}`],
      });
    }
  }

  addMetricPoint({ type, name, tags, value }) {
    switch (type) {
      case 'gauge':
        metrics.gauge(name, value, tags);
        break;
      case 'histogram':
        metrics.histogram(name, value, tags);
        break;
      case 'increment':
        metrics.increment(name, value, tags);
        break;
      default:
        throw new Error(`${type} is not supported.`);
    }
    this.#registerMetric({ type, name, tags });
  }

  addRecurrentMetrics(metricDefinitionsArray, intervalInSeconds) {
    return (...args) => {
      const f = (mem) => () => {
        metricDefinitionsArray.forEach(({ type, name, tags, value, constValue }) => {
          if (constValue) {
            this.addMetricPoint({ type, name, tags, value: constValue });
          } else {
            this.addMetricPoint({ type, name, tags, value: mem()[value] });
          }
        });
      };
      Metrics.intervals.push(setInterval(f(...args), intervalInSeconds));
    };
  }

  #registerMetric({ type, name, tags }) {
    // TODO: vérifie qu'elle n'existe pas déjà
    // TODO: ajouter à la var static
    // TODO: envoyer 0 lors de l'extinction du server
  }

  clearMetrics() {

  }
}
