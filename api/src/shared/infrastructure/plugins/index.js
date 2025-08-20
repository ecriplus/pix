import Inert from '@hapi/inert';
import Vision from '@hapi/vision';

import * as pino from './pino.js';
import * as serverSideCookieSession from './yar.js';

const plugins = [Inert, Vision, pino, serverSideCookieSession];

export { plugins };
