import type { Page } from '@playwright/test';

import { ParticipantsPage } from './index.ts';

export class HomePage {
  constructor(public readonly page: Page) {}

  async goToParticipants() {
    await this.page.getByRole('link', { name: 'Participants', exact: true }).click();
    await this.page.getByText('Participant (1)').waitFor({ state: 'visible' });

    return new ParticipantsPage(this.page);
  }
}
