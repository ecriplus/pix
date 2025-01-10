import { bannerController } from './banner-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/information-banners/{target}',
      config: {
        auth: false,
        handler: bannerController.getInformationBanner,
      },
    },
  ]);
};

const name = 'src-banners-api';
export { name, register };
