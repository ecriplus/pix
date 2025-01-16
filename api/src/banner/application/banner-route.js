import { bannerController } from './banner-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/information-banners/{target}',
      options: {
        auth: false,
        handler: bannerController.getInformationBanner,
        cache: {
          expiresIn: 30 * 1000,
        },
      },
    },
  ]);
};

const name = 'src-banners-api';
export { name, register };
