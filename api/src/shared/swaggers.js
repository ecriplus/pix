import HapiSwagger from 'hapi-swagger';

import packageJSON from '../../package.json' with { type: 'json' };
import { config } from './config.js';
import { logger } from './infrastructure/utils/logger.js';

class PixOpenApiBaseDefinition {
  constructor() {
    this.swaggerConfiguration = {
      OAS: 'v3.0',
      basePath: '/api',
      routeTag: 'api',
      info: {
        version: packageJSON.version,
      },
      jsonPath: '/swagger.json',
      documentationPath: '/documentation',
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
    this.swaggerConfiguration.info.title = 'Welcome to the Pix Authorization server';
    this.swaggerConfiguration.routeTag = 'authorization-server';
  }
}

class LivretScolaire extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.swaggerConfiguration.info.title = 'Welcome to the Pix LSU/LSL Open Api';
    this.swaggerConfiguration.routeTag = 'livret-scolaire';
  }
}

class PoleEmploi extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.swaggerConfiguration.info.title = 'Pix Pôle emploi Open Api';
    this.swaggerConfiguration.routeTag = 'pole-emploi';
  }
}

class Parcoursup extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.swaggerConfiguration.info.title = 'Pix Parcoursup Open Api';
    this.swaggerConfiguration.routeTag = 'parcoursup';
    this.#addExternalPartnersAccess();
  }

  #addExternalPartnersAccess() {
    try {
      this.swaggerConfiguration.servers = [
        {
          url: new URL(config.apiManager.endpoints.parcoursup, config.apiManager.url).href,
          description: 'External Partners access',
        },
      ];

      this.swaggerConfiguration.pathReplacements = [
        {
          replaceIn: 'all',
          pattern: /api\/application\//,
          replacement: '',
        },
      ];
    } catch (error) {
      logger.error(error);
    }
  }
}

class PixAPI extends PixOpenApiBaseDefinition {
  constructor() {
    super();
    this.swaggerConfiguration.grouping = 'tags';
    this.swaggerConfiguration.info.title = 'Welcome to the Pix api catalog';
  }
}

const toHapiPlugin = (swaggerOptions) => {
  return [
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      routes: { prefix: '/' + swaggerOptions.routeTag },
    },
  ];
};

export const swaggers = [AuthorizationServer, LivretScolaire, PoleEmploi, Parcoursup, PixAPI]
  .map((clazz) => new clazz().swaggerConfiguration)
  .map(toHapiPlugin);
