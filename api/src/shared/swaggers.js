import HapiSwagger from 'hapi-swagger';

import packageJSON from '../../package.json' with { type: 'json' };
import { config } from './config.js';
import { logger } from './infrastructure/utils/logger.js';

class PixOpenApiBaseDefinition {
  constructor() {
    /**
     * External API endpoint for the swagger.json
     * @type {string}
     * @public
     */
    this.endpoint = '/api';

    /**
     * Swagger configuration that builds the swagger.json and Swagger UI endpoints
     * @type {Object}
     * @public
     */
    this.swaggerConfiguration = {
      OAS: 'v3.0',
      routeTag: 'api',
      info: {
        version: packageJSON.version,
      },
      jsonPath: '/swagger.json',
      swaggerUIPath: '/documentation/swaggerui/',
      routesBasePath: '/documentation/swaggerui/',
      uiOptions: {
        url: 'swagger.json',
      },
      securityDefinitions: {
        bearerAuth: {
          name: 'Authorization',
          scheme: 'Bearer',
          in: 'header',
          description: 'Example: Bearer eyJ...z',
          type: 'apiKey',
        },
      },
      security: [{ bearerAuth: [], jwt: [] }],
    };
  }
}

class AuthorizationServer extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.endpoint = '/authorization-server';
    this.swaggerConfiguration.info.title = 'Welcome to the Pix Authorization server';
    this.swaggerConfiguration.routeTag = 'authorization-server';
  }
}

class LivretScolaire extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.endpoint = '/livret-scolaire';
    this.swaggerConfiguration.info.title = 'Welcome to the Pix LSU/LSL Open Api';
    this.swaggerConfiguration.routeTag = 'livret-scolaire';
  }
}

class PoleEmploi extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.endpoint = '/pole-emploi';
    this.swaggerConfiguration.info.title = 'Pix Pôle emploi Open Api';
    this.swaggerConfiguration.routeTag = 'pole-emploi';
  }
}

class Parcoursup extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.endpoint = '/api/application/parcoursup';
    this.swaggerConfiguration.basePath = '/api/application';
    this.swaggerConfiguration.info.title = 'Pix Parcoursup Open Api';
    this.swaggerConfiguration.routeTag = 'parcoursup';
    this.#addExternalPartnersAccess();
  }

  /**
   * Create documentation partners accesspoint based on Pix backend APIM configuration
   * @see {@link https://learn.openapis.org/specification/servers.html}
   */
  #addExternalPartnersAccess() {
    const serverUrl = this.#buildUrl(config.apiManager.url);
    if (serverUrl) {
      this.swaggerConfiguration.servers = [
        {
          url: serverUrl,
          description: 'External Partners access',
        },
      ];
    }
  }

  #buildUrl(baseUrl) {
    try {
      return new URL(baseUrl).href;
    } catch (error) {
      // Cannot crash the server for a missing URI
      logger.error(error);
    }
  }
}

class PixAPI extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.endpoint = '/api';
    this.swaggerConfiguration.grouping = 'tags';
    this.swaggerConfiguration.info.title = 'Welcome to the Pix api catalog';
  }
}

const buildHapiPlugin = (clazz) => {
  const apiDefinition = new clazz();

  return [
    {
      plugin: HapiSwagger,
      options: apiDefinition.swaggerConfiguration,
    },
    {
      routes: { prefix: apiDefinition.endpoint },
    },
  ];
};

export const swaggers = [PixAPI, AuthorizationServer, LivretScolaire, PoleEmploi, Parcoursup].map(buildHapiPlugin);
