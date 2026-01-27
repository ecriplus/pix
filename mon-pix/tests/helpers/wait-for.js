import { getScreen } from '@1024pix/ember-testing-library';
import { waitUntil } from '@ember/test-helpers';

const WAIT_UNTIL_TIMEOUT = 3000;

export async function waitForDialog() {
  const screen = await getScreen();

  await waitUntil(
    () => {
      try {
        screen.getByRole('dialog');
        return true;
      } catch {
        return false;
      }
    },
    { timeout: WAIT_UNTIL_TIMEOUT },
  );
}

export async function waitForDialogClose() {
  const screen = await getScreen();

  await waitUntil(
    () => {
      try {
        screen.getByRole('dialog');
        return false;
      } catch {
        return true;
      }
    },
    { timeout: WAIT_UNTIL_TIMEOUT },
  );
}
