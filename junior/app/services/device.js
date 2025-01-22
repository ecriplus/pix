import Service from '@ember/service';

const MOBILE_MAX_HEIGHT = 720;
const MOBILE_MAX_WIDTH = 540;
const TABLET_MAX_HEIGHT = 1366;
const TABLET_MAX_WIDTH = 1024;

export const types = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
};

export default class DeviceService extends Service {
  get info() {
    let orientation = screen.orientation?.type;
    if (!orientation) {
      orientation = screen.width > screen.height ? 'landscape' : 'portrait';
    }
    return {
      orientation: orientation,
      type: this.getType(orientation),
    };
  }

  getType(orientation) {
    if (orientation.startsWith('landscape')) {
      if (screen.width >= TABLET_MAX_HEIGHT) {
        return types.DESKTOP;
      }
      if (screen.width >= MOBILE_MAX_HEIGHT && screen.height >= MOBILE_MAX_WIDTH) {
        return types.TABLET;
      }
      return types.MOBILE;
    } else {
      if (screen.width >= TABLET_MAX_WIDTH) {
        return types.DESKTOP;
      }
      if (screen.width >= MOBILE_MAX_WIDTH) {
        return types.TABLET;
      }
      return types.MOBILE;
    }
  }
}
