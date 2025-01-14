import HapiSwagger from 'hapi-swagger';

import packageJSON from '../../package.json' with { type: 'json' };
import { config } from './config.js';

const swaggerOptionsAuthorizationServer = {
  routeTag: 'authorization-server',
  info: {
    title: 'Welcome to the Pix Authorization server',
    version: packageJSON.version,
  },
  jsonPath: '/swagger.json',
};

const swaggerOptionsLivretScolaire = {
  routeTag: 'livret-scolaire',
  info: {
    title: 'Welcome to the Pix LSU/LSL open api',
    version: packageJSON.version,
  },
  jsonPath: '/swagger.json',
};

const swaggerOptionsPoleEmploi = {
  routeTag: 'pole-emploi',
  info: {
    title: 'Pix Pôle emploi open api',
    version: packageJSON.version,
  },
  jsonPath: '/swagger.json',
};

const swaggerOptionsParcoursup = {
  routeTag: 'parcoursup',
  OAS: 'v3.0',
  servers: [
    {
      url: `${config.apiManager.url}/parcoursup/`,
      description: 'External Partners access',
    },
  ],
  pathReplacements: [
    {
      replaceIn: 'all',
      pattern: /api\/application\//,
      replacement: '',
    },
  ],
  info: {
    title: 'Pix Parcoursup Open Api',
    version: packageJSON.version,
  },
  jsonPath: '/swagger.json',
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

const swaggerOptionsIn = {
  basePath: '/api',
  grouping: 'tags',
  routeTag: 'api',
  OAS: 'v3.0',
  uiOptions: {
    url: 'swagger.json',
  },
  info: {
    title: 'Welcome to the Pix api catalog',
    version: packageJSON.version,
  },
  documentationPath: '/documentation',
  jsonPath: '/swagger.json',
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

function _buildSwaggerArgs(swaggerOptions) {
  return [
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      routes: { prefix: '/' + swaggerOptions.routeTag },
    },
  ];
}

const swaggers = [
  swaggerOptionsAuthorizationServer,
  swaggerOptionsLivretScolaire,
  swaggerOptionsPoleEmploi,
  swaggerOptionsParcoursup,
  swaggerOptionsIn,
].map(_buildSwaggerArgs);

export { swaggers };
